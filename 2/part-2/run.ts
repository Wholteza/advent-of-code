import { RawSequence, sequences } from "./constants";

type Sequence = {
  min: number;
  max: number;
  char: string;
  password: string;
};

const mapSequence = (sequence: RawSequence): Sequence => ({
  min: sequence[0],
  max: sequence[1],
  char: sequence[2],
  password: sequence[3],
});

const passwordIsValid = (sequence: Sequence): boolean => {
  const a = +(sequence.password[sequence.min - 1] === sequence.char);
  const b = +(sequence.password[sequence.max - 1] === sequence.char);
  return (a + b) === 1;
};

let amountOfValidPasswords = sequences
  .map(mapSequence)
  .reduce<number>(
    (aggregate: number, current: Sequence): number =>
      passwordIsValid(current) ? aggregate + 1 : aggregate,
    0
  );

console.log(amountOfValidPasswords);
