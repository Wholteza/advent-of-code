import fs from "fs";

const digitRegex = /\d/;

const readContentsOfFile = (relativePath: string): string =>
  fs.readFileSync(relativePath).toString();

const toArrayOfRows = (text: string): string[] =>
  text.split("\n").filter((row) => !!row);

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

const partOneTestResultsAreNotCorrect = (): boolean => {
  const testResultsFromExercise = 142;
  const result = getSumOfNumbersFromEachRow(readContentsOfFile("test-input-a"));
  return result !== testResultsFromExercise;
};

const calculateResult = (): number =>
  getSumOfNumbersFromEachRow(readContentsOfFile("input"));

if (partOneTestResultsAreNotCorrect())
  throw new Error("Test results are not correct");
console.log("Test results are correct");
console.log(`Result is ${calculateResult()}`);

console.log("End of part one\n\nStart of part two");

const turnLettersIntoNumbers = (input: string): string => {
  const wordToNumberMap = {
    seven: 7,
    eight: 8,
    three: 3,
    four: 4,
    five: 5,
    nine: 9,
    one: 1,
    two: 2,
    six: 6,
  };
  const numbersRegex = /(one|two|three|four|five|six|seven|eight|nine)/;
  for (let i = 0; i < input.length; i++) {
    const section = input.slice(i);
    const match = numbersRegex.exec(section)?.[0];
    if (!match || section.indexOf(match) !== 0) continue;
    input = `${input.slice(0, i)}${
      wordToNumberMap[match as keyof typeof wordToNumberMap]
    }${input.slice(i + match.length - 1)}`;
  }
  return input;
};

const calculateResultOfPartTwo = (fileName: string): number =>
  toArrayOfRows(readContentsOfFile(fileName))
    .map(turnLettersIntoNumbers)
    .map(getTwoDigitNumberOfRow)
    .reduce((sum, current) => sum + current, 0);

const runPartTwoTest = (): void => {
  const testResultsFromExercise = 281;
  const result = calculateResultOfPartTwo("test-input-b");
  if (result !== testResultsFromExercise)
    throw new Error(`Expected ${testResultsFromExercise}, got ${result}`);
  console.log("Test passed!");
};

console.log(`Result is ${calculateResultOfPartTwo("input")}`);
