import fs from "fs";

const EMPTY = "";
const SPLIT_REGEX = /(#|.)/;

const rawInput: string = fs.readFileSync("input", "utf-8");
const input: string[] = rawInput.split("\n");
export const map: string[][] = input.map((row) =>
  row
    .split(SPLIT_REGEX)
    .reduce<string[]>(
      (aggregate: string[], current: string): string[] =>
        current === EMPTY ? aggregate : [...aggregate, current],
      []
    )
);
