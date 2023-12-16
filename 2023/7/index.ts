import fs from "fs";

// read hands
const readHands = (filename: string): { bid: string; hand: string }[] =>
  fs
    .readFileSync(filename, "utf8")
    .split("\n")
    .map((row) => {
      const { bid, hand } =
        /(?<hand>.{5}) (?<bid>\d+)/m.exec(row)?.groups ?? {};
      return { bid, hand };
    });

class Hand {
  bid: string;
  hand: string;
  constructor({ bid, hand }: { bid: string; hand: string }) {
    this.bid = bid;
    this.hand = hand;
  }
}
// Create hands
// figure out their type
// compare hands
// give them ranks
// calculate score

const dayFivePartOneResults = (filename: string): number => {
  const acceleration = 1;
  readHands(filename);
  return 0;
};

const dayFivePartOneTest = () => {
  const expected = 288;
  const result = dayFivePartOneResults("test-input-a");
  if (result !== expected)
    throw new Error(`Expected ${expected}, got ${result}.`);
  console.log("Test passed!");
};

dayFivePartOneTest();
console.log("The result is: ", dayFivePartOneResults("input"));
