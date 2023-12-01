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
  const replacements: { match: string; replaceWith: number }[] = [
    { match: "one", replaceWith: 1 },
    { match: "two", replaceWith: 2 },
    { match: "three", replaceWith: 3 },
    { match: "four", replaceWith: 4 },
    { match: "five", replaceWith: 5 },
    { match: "six", replaceWith: 6 },
    { match: "seven", replaceWith: 7 },
    { match: "eight", replaceWith: 8 },
    { match: "nine", replaceWith: 9 },
  ];
  let lettersLeft = input;
  let newRow = "";
  while (lettersLeft.length) {
    newRow += lettersLeft[0];
    lettersLeft = lettersLeft.slice(1);
    replacements.forEach(
      (replacement) =>
        (newRow = newRow.replace(
          replacement.match,
          replacement.replaceWith.toString()
        ))
    );
    if (!lettersLeft) break;
  }
  return newRow;
};

const calculateResultOfPartTwo = (fileName: string): number =>
  toArrayOfRows(readContentsOfFile(fileName))
    .map(turnLettersIntoNumbers)
    .map(getTwoDigitNumberOfRow)
    .reduce((sum, current) => sum + current, 0);

const partTwoTestResultsAreNotCorrect = (): boolean => {
  const testResultsFromExercise = 281;
  const result = calculateResultOfPartTwo("test-input-b");
  console.log(result, testResultsFromExercise);
  return result !== testResultsFromExercise;
};

if (partTwoTestResultsAreNotCorrect())
  throw new Error("Test results are not correct");
console.log("Test results are correct");
console.log(`Result is ${calculateResultOfPartTwo("input")}`);
