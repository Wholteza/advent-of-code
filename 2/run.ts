import { Sequence, sequences } from "./constants";

type Password = {
  min: number;
  max: number;
  char: string;
  password: string;
};

const sequenceToPassword = (sequence: Sequence): Password => ({
  min: sequence[0],
  max: sequence[1],
  char: sequence[2],
  password: sequence[3],
});

const passwordIsValid = (password: Password): boolean =>
  password.min <= password.password.split(password.char).length - 1 &&
  password.password.split(password.char).length - 1 <= password.max;

sequences.every((s: Sequence) => {
  const password = sequenceToPassword(s);
  if (!passwordIsValid(password)) {
    console.log(password.password);
    return false;
  }
  return true;
});
