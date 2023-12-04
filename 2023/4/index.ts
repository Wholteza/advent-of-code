import fs from "fs";

class ScratchCard {
  private numbers: number[];
  private winningNumbers: number[];

  constructor(input: string) {
    const [_cardNumber, numbersOnCard] = input.split(":");
    const [unprocessedWinningNumbers, unprocessedNumbers] =
      numbersOnCard.split("|");
    this.winningNumbers = this.toNumbers(unprocessedWinningNumbers);
    this.numbers = this.toNumbers(unprocessedNumbers);
  }

  public getPoints = (): number =>
    this.getWinningNumbers().reduce(
      (sum, current, index) => (index ? sum * 2 : 1),
      0
    );

  public getWinningNumbers = (): number[] =>
    this.numbers.filter((n) => this.winningNumbers.includes(n));

  private toNumbers = (stringOfNumbers: string): number[] =>
    Array.from(stringOfNumbers.match(/(\d+)/g) ?? []).map((v) => Number(v));
}

const getPartOneResult = (fileName: string): number => {
  const fileText = fs.readFileSync(fileName, "utf-8");
  const rows = fileText
    .replace("\r\n", "\n")
    .split("\n")
    .filter((row) => !!row);
  const scratchCards = rows.map((r) => new ScratchCard(r));
  const sumOfPoints = scratchCards.reduce(
    (sum, scratchCard) => sum + scratchCard.getPoints(),
    0
  );
  return sumOfPoints;
};

const runPartOneTest = () => {
  const expected = 13;
  const result = getPartOneResult("test-input-a");
  if (result !== expected)
    throw new Error(`Expected ${expected}, got ${result}`);
  console.log("Test passed!");
};

runPartOneTest();
let result = getPartOneResult("input");
console.log(`Result is: ${result}`);

class ScratchCardFactory {
  private rows: string[];
  constructor(input: string) {
    this.rows = input
      .replace("\r\n", "\n")
      .split("\n")
      .filter((row) => !!row);
  }

  public getScratchCardOrDefault = (number: number): ScratchCardV2 | null =>
    number > this.rows.length ? null : new ScratchCardV2(this.rows[number - 1]);

  public getAll = () => this.rows.map((r) => new ScratchCardV2(r));
}
class ScratchCardV2 extends ScratchCard {
  private number: number;
  constructor(input: string) {
    super(input);
    this.number = Number(/^Card\s+(?<number>\d+)/.exec(input)?.groups?.number);
  }

  public getTotalAmountOfScratchCards = (
    factory: ScratchCardFactory
  ): number => {
    const winningNumbers = this.getWinningNumbers();
    const rewardCardNumbers = new Array(winningNumbers.length)
      .fill(this.number + 1)
      .map((number, index) => number + index);
    const rewardCards = rewardCardNumbers
      .map((n) => factory.getScratchCardOrDefault(n))
      .reduce<ScratchCardV2[]>(
        (nonNullRewards, card) =>
          card ? [...nonNullRewards, card] : nonNullRewards,
        []
      );
    const amountOfRewardScratchCards = rewardCards.reduce(
      (sum, card) => card.getTotalAmountOfScratchCards(factory) + sum,
      0
    );

    return 1 + amountOfRewardScratchCards;
  };
}

const getPartTwoResult = (fileName: string): number => {
  const fileText = fs.readFileSync(fileName, "utf-8");
  const factory = new ScratchCardFactory(fileText);
  const scratchCards = factory.getAll();
  const totalAmountOfScratchCards = scratchCards.reduce(
    (sum, scratchCard) =>
      sum + scratchCard.getTotalAmountOfScratchCards(factory),
    0
  );
  return totalAmountOfScratchCards;
};

const runPartTwoTest = () => {
  const expected = 30;
  const result = getPartTwoResult("test-input-a");
  if (result !== expected)
    throw new Error(`Expected ${expected}, got ${result}`);
  console.log("Test passed!");
};

runPartTwoTest();
result = getPartTwoResult("input");
console.log(`Result is: ${result}`);
