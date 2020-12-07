import fs from "fs";

const DOUBLE_LINEBREAK = "\n\n";
const SINGLE_LINEBREAK = "\n";

const rawInput: string = fs.readFileSync("input", "utf-8");

const groupByGroupInput = (value: string): string[] =>
  value.split(DOUBLE_LINEBREAK);

const formatGroupInput = (value: string): string[] =>
  value.split(SINGLE_LINEBREAK);

export const groups = groupByGroupInput(rawInput).map(formatGroupInput);
