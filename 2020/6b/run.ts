import { groups } from "./parsed-input";

const separateLongestFromOther = (sequences: string[]): [string, string[]] => {
  const longest = sequences
    .sort((a, b) => (a.length > b.length ? -1 : 1))
    .pop();
  return [longest, sequences];
};

console.log(
  groups.reduce((aggregate: number, currentGroup: string[]): number => {
    const [longest, other] = separateLongestFromOther(currentGroup);
    let correctAnswers = 0;
    for (let char of longest) {
      other.every((o) => o.includes(char)) && correctAnswers++;
    }
    return aggregate + correctAnswers;
  }, 0)
);
