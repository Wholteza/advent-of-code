import fs from "fs";

// read hands
const readHands = (filename: string) =>
  Array.from(
    /(?<hand>.{5}) (?<bid>\d+)/g.exec(fs.readFileSync(filename, "utf8")) ?? []
  )
    .map(row) => row)
    .forEach(console.log);

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
