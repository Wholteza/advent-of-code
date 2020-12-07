import { sequence } from "./constants";

const c = 2020;

const calculateB = (a: number) => c - a;

sequence.every((a: number) => {
  const b = calculateB(a);
  if (sequence.includes(b)) {
    console.log(a * b);
    return false;
  }
  return true;
});
