import { map, Passport } from "./parsed-input";

const yearValidation = (
  year: string | undefined,
  min: number,
  max: number
): boolean =>
  !!year && year.length === 4 && +year !== NaN && min <= +year && +year <= max;

const byrIsValid = (value: string | undefined) =>
  yearValidation(value, 1920, 2002);

const iyrIsValid = (value: string | undefined) =>
  yearValidation(value, 2010, 2020);

const eyrIsValid = (value: string | undefined) =>
  yearValidation(value, 2020, 2030);

const hgtIsValid = (value: string | undefined) => {
  if (!value) return false;
  const unitHeightPair = [value.split(/(cm|in)/)[1], value.split(/(cm|in)/)[0]];
  if (!unitHeightPair[0] || !+unitHeightPair[1]) return false;
  return unitHeightPair[0] === "cm"
    ? 150 <= +unitHeightPair[1] && +unitHeightPair[1] <= 193
    : unitHeightPair[0] === "in"
    ? 59 <= +unitHeightPair[1] && +unitHeightPair[1] <= 76
    : false;
};

const lengthAndPatternValidation = (
  value: string | undefined,
  length: number,
  pattern: RegExp,
  ignoreCase?: boolean
) =>
  !!value &&
  value.length === length &&
  RegExp(pattern, ignoreCase ? "gi" : "g").test(value);

const hclIsValid = (value: string | undefined) =>
  lengthAndPatternValidation(value, 7, /#[a-f|0-9]{6}/, true);

const eclIsValid = (value: string | undefined) =>
  lengthAndPatternValidation(value, 3, /(amb|blu|brn|gry|grn|hzl|oth)/);

const pidIsValid = (value: string | undefined) =>
  lengthAndPatternValidation(value, 9, /[0-9]{9}/);

const isValid = (passport: Passport) =>
  !!(
    byrIsValid(passport.byr) &&
    iyrIsValid(passport.iyr) &&
    eyrIsValid(passport.eyr) &&
    hgtIsValid(passport.hgt) &&
    hclIsValid(passport.hcl) &&
    eclIsValid(passport.ecl) &&
    pidIsValid(passport.pid)
  );

console.log(
  map.reduce<number>(
    (validCount, current) => (isValid(current) ? validCount + 1 : validCount),
    0
  )
);
