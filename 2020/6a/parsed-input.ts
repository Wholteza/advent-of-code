import fs from "fs";

const DOUBLE_LINEBREAK = "\n\n";
const SINGLE_LINEBREAK = "\n";
const EMPTY = "";

const rawInput: string = fs.readFileSync("input", "utf-8");

const groupByGroupInput = (value: string): string[] =>
  value.split(DOUBLE_LINEBREAK);

const formatGroupInput = (value: string): string => {
  const newValue = value.replace(SINGLE_LINEBREAK, EMPTY);
  return newValue.includes(SINGLE_LINEBREAK)
    ? formatGroupInput(newValue)
    : newValue;
};

const distinct = (group: string): string => {
  let distinct = "";
  for (let char of group)
    distinct = distinct.includes(char) ? distinct : `${distinct}${char}`;
  return distinct;
};

export const groups = groupByGroupInput(rawInput)
  .map(formatGroupInput)
  .map(distinct);
