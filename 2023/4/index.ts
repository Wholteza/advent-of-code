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

  private getWinningNumbers = (): number[] =>
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
const result = getPartOneResult("input");
console.log(`Result is: ${result}`);
