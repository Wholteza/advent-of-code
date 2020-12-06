import { map, Passport } from "./parsed-input";

const isValid = (passport: Passport) =>
  !!(
    passport.byr &&
    passport.iyr &&
    passport.eyr &&
    passport.hgt &&
    passport.hcl &&
    passport.ecl &&
    passport.pid
  );

console.log(
  map.reduce<number>(
    (validCount, current) => (isValid(current) ? validCount + 1 : validCount),
    0
  )
);
