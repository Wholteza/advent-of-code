import { readFileSync } from "fs";

const rawInput = readFileSync("./input", "utf-8");
const rows = rawInput.split("\r\n");

class Rucksack {
  private backpackItems: string;
  private compartmentSize: number;
  constructor(backpackItems: string) {
    this.backpackItems = backpackItems;
    this.compartmentSize = backpackItems.length / 2;
  }
  private getItemsInCompartmentOne = (): string[] => [
    ...this.backpackItems.substring(0, this.compartmentSize),
  ];
  private getItemsInCompartmentTwo = (): string[] => [
    ...this.backpackItems.substring(this.compartmentSize),
  ];

  public getFirstItemPresentInBothCompartments = (): string | undefined => {
    const compartmentOne = this.getItemsInCompartmentOne();
    const compartmentTwo = this.getItemsInCompartmentTwo();
    const inBoth = compartmentOne.filter((itemOne) =>
      compartmentTwo.includes(itemOne)
    );
    return inBoth[0];
  };

  public itemExistsInBackpack = (item: string) =>
    this.backpackItems.includes(item);

  public getItemsPresentInBothRucksacks = (other: Rucksack): string[] =>
    [...this.backpackItems].reduce<string[]>(
      (agg, current): string[] =>
        other.itemExistsInBackpack(current) ? [...agg, current] : agg,
      []
    );
}

const missplacedItems = rows.map((r) =>
  new Rucksack(r).getFirstItemPresentInBothCompartments()
);

const calculateValueOfItem = (item: string) => {
  const asciiCode = item.charCodeAt(0);
  const isLowerCase = (code: number) => code >= 97 && code <= 122;
  return isLowerCase(asciiCode) ? asciiCode - 96 : asciiCode - 38;
};

const valueOfMissingItems = missplacedItems.reduce<number>(
  (sum, current) => (!current ? sum : sum + calculateValueOfItem(current)),
  0
);

console.log("Answer #1: ", valueOfMissingItems);

class Group {
  private rucksacks: Rucksack[] = [];
  public getMembersOfGroupCount = (): number => this.rucksacks.length;
  public addRucksack = (rucksack: Rucksack) => this.rucksacks.push(rucksack);
  public getGroupBadge = () => {
    const [first, second, third] = this.rucksacks;
    const commonBetweenFirstAndSecond =
      first.getItemsPresentInBothRucksacks(second);
    const commonBetweenFirstAndThird =
      first.getItemsPresentInBothRucksacks(third);
    const presentInAllThree = commonBetweenFirstAndSecond.find((f) =>
      commonBetweenFirstAndThird.includes(f)
    );
    return presentInAllThree;
  };
}

class GroupsBuilder {
  private groups: Group[] = [];
  private currentGroup: Group = new Group();

  public addRucksack = (rucksack: Rucksack) => {
    if (this.currentGroup.getMembersOfGroupCount() === 3) {
      this.groups.push(this.currentGroup);
      this.currentGroup = new Group();
    }
    this.currentGroup.addRucksack(rucksack);
  };

  public build = () => [...this.groups, this.currentGroup];
}

const groupsBuilder = new GroupsBuilder();
rows.forEach((r) => groupsBuilder.addRucksack(new Rucksack(r)));
const groups = groupsBuilder.build();

const badges = groups.map((g) => g.getGroupBadge());

const valueOfBadges = badges.reduce<number>(
  (sum, badge) => (!badge ? sum : sum + calculateValueOfItem(badge)),
  0
);
console.log("Answer #2: ", valueOfBadges);
