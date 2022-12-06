import { readFileSync } from "fs";

const detectUniqueSequence = (length: number) =>
  rawInput.split("").reduce<string[]>((sequence, current) => {
    const sequenceIsUnique = sequence.every(
      (i) => sequence.filter((s) => s === i).length === 1
    );
    const sequenceIsAtMaxLength = sequence.length === length;
    if (sequenceIsAtMaxLength) {
      if (sequenceIsUnique) return sequence;
      sequence = sequence.slice(1);
    }
    return [...sequence, current];
  }, []);

const getPositionOfSequence = (sequence: string[], rawInput: string) =>
  rawInput.indexOf(sequence.join("")) + sequence.length;

const rawInput = readFileSync("./input", "utf-8");

console.log(
  "Answer #1: ",
  getPositionOfSequence(detectUniqueSequence(4), rawInput)
);

console.log(
  "Answer #2: ",
  getPositionOfSequence(detectUniqueSequence(14), rawInput)
);
