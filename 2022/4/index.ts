import { readFileSync } from "fs";

class Range {
  private beginning: number;
  private end: number;
  constructor(input: string) {
    [this.beginning, this.end] = input
      .split("-")
      .map((rangeParameterAsString) => +rangeParameterAsString);
  }

  private getRange = () => {
    const range: number[] = [];
    for (let index = this.beginning; index <= this.end; index++)
      range.push(index);
    return range;
  };

  public containsCompleteRangeOf = (other: Range): boolean => {
    const [currentRange, otherRange] = [this.getRange(), other.getRange()];
    return currentRange.every((i) => otherRange.includes(i));
  };

  public overlapsWith = (other: Range): boolean => {
    const [currentRange, otherRange] = [this.getRange(), other.getRange()];
    return currentRange.some((i) => otherRange.includes(i));
  };
}

const createRangePairsFromRows = (rows: string[]): Range[][] =>
  rows.map((row) => row.split(",").flatMap((pair) => new Range(pair)));

const calculateSumOfRangePairsThatCompletelyOverlap = (rangePairs: Range[][]) =>
  rangePairs.reduce<number>(
    (sumOfRangesThatCompletelyOverlap, [firstRange, secondRange]) =>
      firstRange.containsCompleteRangeOf(secondRange) ||
      secondRange.containsCompleteRangeOf(firstRange)
        ? sumOfRangesThatCompletelyOverlap + 1
        : sumOfRangesThatCompletelyOverlap,
    0
  );

const rawInput = readFileSync("./input", "utf-8");
const rows = rawInput.split("\r\n");
const rangePairs = createRangePairsFromRows(rows);
const sumOfRangesThatCompletelyOverlap =
  calculateSumOfRangePairsThatCompletelyOverlap(rangePairs);
console.log("Answer #1: ", sumOfRangesThatCompletelyOverlap);

const calculateSumOfOverlappingRangePairs = (rangePairs: Range[][]) =>
  rangePairs.reduce<number>(
    (sumOfRangesThatOverlap, [firstRange, secondRange]) =>
      firstRange.overlapsWith(secondRange) ||
      secondRange.overlapsWith(firstRange)
        ? sumOfRangesThatOverlap + 1
        : sumOfRangesThatOverlap,
    0
  );

const sumOfRangesThatOverlap = calculateSumOfOverlappingRangePairs(rangePairs);
console.log("Answer #2: ", sumOfRangesThatOverlap);
