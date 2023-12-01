import fs from "fs";

const digitRegex = /\d/;

const readContentsOfFile = (relativePath: string): string =>
  fs.readFileSync(relativePath).toString();

const toArrayOfRows = (text: string): string[] => text.split("\n");

const getFirstDigit = (input: string): number => {
  const match = input.match(digitRegex);
  if (!match) throw new Error("No digit found");
  return parseInt(match[0]);
};

const getTwoDigitNumberOfRow = (row: string): number => {
  const firstDigit = getFirstDigit(row);
  const lastDigit = getFirstDigit(row.split("").toReversed().join(""));
  return Number(`${firstDigit}${lastDigit}`);
};

const getSumOfNumbersFromEachRow = (input: string): number =>
  toArrayOfRows(input)
    .map(getTwoDigitNumberOfRow)
    .reduce((sum, current) => sum + current, 0);

const testResultsAreNotCorrect = (): boolean => {
  const testResultsFromExercise = 142;
  const result = getSumOfNumbersFromEachRow(readContentsOfFile("test-input"));
  return result !== testResultsFromExercise;
};

const calculateResult = (): number =>
  getSumOfNumbersFromEachRow(readContentsOfFile("input"));

if (testResultsAreNotCorrect()) throw new Error("Test results are not correct");
console.log("Test results are correct");
console.log(`Result is ${calculateResult()}`);
