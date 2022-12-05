import { readFileSync } from "fs";

type Crate = {
  content: string;
};

class Stack {
  private crates: Crate[];
  constructor() {
    this.crates = [];
  }
  public liftUp = () => {
    const [topCrate, ...rest] = this.crates;
    this.crates = rest;
    return topCrate;
  };

  public putDown = (crate: Crate) => (this.crates = [crate, ...this.crates]);

  public liftUpMultiple = (amount: number): Crate[] => {
    const cratesToLift = this.crates.slice(0, amount);
    this.crates = this.crates.slice(amount);
    return cratesToLift;
  };

  public putDownMultiple = (cratesToPutDown: Crate[]): void => {
    this.crates = [...cratesToPutDown, ...this.crates];
  };

  public getTopCrate = (): Crate | undefined => this.crates[0];
}

class Instruction {
  public from: string;
  public to: string;
  public amount: number;
  constructor(rawInput: string) {
    this.amount = +rawInput
      .substring(0, rawInput.indexOf(" from"))
      .replace("move ", "");
    this.from = rawInput.split(" from ")[1].split(" to ")[0];
    this.to = rawInput.split(" to ")[1];
  }
}

type StackInventoryMap = { [Key: string]: Stack };
class GiantCargoCrane {
  private stacks: StackInventoryMap;
  private model: "9000" | "9001";
  constructor(model: "9000" | "9001", stacks: StackInventoryMap) {
    this.stacks = stacks;
    this.model = model;
  }
  private moveSingle = (from: string, to: string) => {
    const fromStack = this.stacks[from];
    const toStack = this.stacks[to];
    toStack.putDown(fromStack.liftUp());
  };
  public moveCrates = (instruction: Instruction) => {
    if (this.model === "9000") {
      for (let i = 0; i < instruction.amount; i++) {
        this.moveSingle(instruction.from, instruction.to);
      }
      return;
    }
    this.moveMultiple(instruction);
  };

  private moveMultiple = (instruction: Instruction) => {
    this.stacks[instruction.to].putDownMultiple(
      this.stacks[instruction.from].liftUpMultiple(instruction.amount)
    );
  };

  public getTopCrates = (): Crate[] =>
    Object.keys(this.stacks)
      .map((key) => this.stacks[key].getTopCrate())
      .reduce<Crate[]>(
        (topCrates, current): Crate[] =>
          !!current ? [...topCrates, current] : topCrates,
        []
      );
}

type OrganizedRawInput = { headers: string; stackContentBottomFirst: string[] };
type OrganizedHeaderInformation = { identifier: string; columnIndex: number };

class StackInventoryFactory {
  public static createStackInventory = (
    rawInput: string
  ): StackInventoryMap => {
    const organizedInput = this.organizeInput(rawInput);
    const stackInventoryMap = this.createStackInventoryMap(organizedInput);
    this.populateStacks(organizedInput, stackInventoryMap);
    return stackInventoryMap;
  };

  private static createStackInventoryMap = ({ headers }: OrganizedRawInput) =>
    this.getHeaderInformationFromRow(headers).reduce<StackInventoryMap>(
      (map, header) => {
        return { ...map, [header.identifier]: new Stack() };
      },
      {}
    );

  private static getHeaderInformationFromRow = (
    headerRow: string
  ): { identifier: string; columnIndex: number }[] => {
    const headerIdentifiers = headerRow.split(" ").filter((r) => r !== "");
    return headerIdentifiers.map((hi) => ({
      identifier: hi,
      columnIndex: headerRow.indexOf(hi),
    }));
  };
  private static organizeInput = (rawInput: string): OrganizedRawInput => {
    const [_emptyRow, headers, ...stackContentBottomFirst] = rawInput
      .split("\r\n")
      .filter((row) => !row.includes("move"))
      .reverse();
    return { headers, stackContentBottomFirst };
  };

  private static populateStacks = (
    input: OrganizedRawInput,
    stackInventoryMap: StackInventoryMap
  ): void => {
    const headerMap = this.createMapFromHeaderInformation(
      this.getHeaderInformationFromRow(input.headers)
    );

    input.stackContentBottomFirst.forEach((stackContent) => {
      Object.keys(stackInventoryMap).forEach((stackIdentifier) => {
        const crateContentIndex = headerMap[stackIdentifier].columnIndex;
        const content = stackContent[crateContentIndex];
        const crate: Crate = { content };
        if (crate.content !== " ")
          stackInventoryMap[stackIdentifier].putDown(crate);
      });
    });
  };

  private static createMapFromHeaderInformation = (
    headerInformation: OrganizedHeaderInformation[]
  ): { [Key: string]: OrganizedHeaderInformation } =>
    headerInformation.reduce(
      (map, headerInformation) => ({
        ...map,
        [headerInformation.identifier]: headerInformation,
      }),
      {}
    );
}

const rawInput = readFileSync("./input", "utf-8");
const rawInputRows = rawInput.split("\r\n");
const instructions = rawInputRows
  .filter((r) => r.includes("move"))
  .map((i) => new Instruction(i));

let crane = new GiantCargoCrane(
  "9000",
  StackInventoryFactory.createStackInventory(rawInput)
);
instructions.forEach((i) => crane.moveCrates(i));
let topCrates = crane.getTopCrates();
console.log("Answer #1: ", topCrates.flatMap((tc) => tc.content).join(""));

crane = new GiantCargoCrane(
  "9001",
  StackInventoryFactory.createStackInventory(rawInput)
);
instructions.forEach((i) => crane.moveCrates(i));
topCrates = crane.getTopCrates();
console.log("Answer #2: ", topCrates.flatMap((tc) => tc.content).join(""));
