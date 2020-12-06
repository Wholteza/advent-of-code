import fs from "fs";

export type BoardingPassCode = {
  rowSequence?: string[];
  columnSequence?: string[];
};

const LINEBREAK_OR_WHITESPACE = /(\n| )/;

const rawInput: string = fs.readFileSync("input", "utf-8");

const stringToArray = (value: string) => {
  const array = [];
  for (let i = 0; i < value.length; i++) array.push(value[i]);
  return array;
};

export const boardingPassCodes: BoardingPassCode[] = rawInput
  .split(LINEBREAK_OR_WHITESPACE)
  .reduce<string[]>(
    (a, c) => (LINEBREAK_OR_WHITESPACE.test(c) ? a : [...a, c]),
    []
  )
  .map(
    (rawBoardingPass): BoardingPassCode => ({
      rowSequence: stringToArray(rawBoardingPass.slice(0, 7)),
      columnSequence: stringToArray(rawBoardingPass.slice(7)),
    })
  );
