import { readFileSync } from "fs";

const detectSequenceOfUniqueCharacters = (
  sequenceLength: number,
  rawSignal: string
) =>
  rawSignal
    .split("")
    .reduce<string[]>((sequence, current) => {
      const sequenceIsUnique = sequence.every(
        (i) => sequence.filter((s) => s === i).length === 1
      );
      const sequenceIsAtMaxLength = sequence.length === sequenceLength;
      if (sequenceIsAtMaxLength) {
        if (sequenceIsUnique) return sequence;
        sequence = sequence.slice(1);
      }
      return [...sequence, current];
    }, [])
    .join("");

const getPositionOfSequenceInSignal = (sequence: string, rawSignal: string) =>
  rawSignal.indexOf(sequence) + sequence.length;

const rawSignal = readFileSync("./input", "utf-8");

console.log(
  "Answer #1: ",
  getPositionOfSequenceInSignal(
    detectSequenceOfUniqueCharacters(4, rawSignal),
    rawSignal
  )
);

console.log(
  "Answer #2: ",
  getPositionOfSequenceInSignal(
    detectSequenceOfUniqueCharacters(14, rawSignal),
    rawSignal
  )
);
