import fs from "fs";

export type Passport = {
  byr?: string;
  iyr?: string;
  eyr?: string;
  hgt?: string;
  hcl?: string;
  ecl?: string;
  pid?: string;
  cid?: string;
};

const EMPTY = "\n\n";
const SPLIT_PASSPORTS_REGEX = /(\n\n)/;
const SPLIT_PASSPORT_VALUES_REGEX = /(\n| )/;

const rawInput: string = fs.readFileSync("input", "utf-8");
const rawPassports: string[] = rawInput
  .split(SPLIT_PASSPORTS_REGEX)
  .reduce((a, c) => (c === EMPTY ? a : [...a, c]), []);

export const map: Passport[] = rawPassports.reduce<Passport[]>(
  (aggregate: Passport[], current: string): Passport[] => {
    const passport: Passport = {};
    const keyValuePairs = current
      .split(SPLIT_PASSPORT_VALUES_REGEX)
      .map((keyValue) => keyValue.split(":"));
    keyValuePairs.forEach((kvp) => (passport[kvp[0]] = kvp[1]));
    return [...aggregate, passport];
  },
  []
);
