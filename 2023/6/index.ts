import fs from "fs";

type Race = { time: number; distance: number };

const rowToNumbers = (row: string): number[] =>
  Array.from(row.match(/(\d+)/g) ?? []).map(Number);

const fileToRaces = (filename: string): Race[] => {
  const file = fs.readFileSync(filename, "utf-8");
  const [timesRow, distancesRow] = file.split("\n");
  const times = rowToNumbers(timesRow);
  const distances = rowToNumbers(distancesRow);
  return times.map((time, index) => ({ time, distance: distances[index] }));
};

const raceToAmountOfWinningPossibilities = (
  race: Race,
  acceleration: number
): number => {
  let winningPossibilities = 0;
  for (
    let secondsHoldingTheButton = 0;
    secondsHoldingTheButton <= race.time;
    secondsHoldingTheButton++
  ) {
    const speed = secondsHoldingTheButton * acceleration;
    const timeToRun = race.time - secondsHoldingTheButton;
    const distance = speed * timeToRun;
    if (distance <= race.distance) continue;
    winningPossibilities++;
  }
  return winningPossibilities;
};

const dayFivePartOneResults = (filename: string): number => {
  const acceleration = 1;
  return fileToRaces(filename)
    .map((race) => raceToAmountOfWinningPossibilities(race, acceleration))
    .reduce((sum, current) => (sum ? sum * current : current), 0);
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

const mergeRaces = (races: Race[]): Race => ({
  time: Number(races.map((r) => r.time.toString()).join("")),
  distance: Number(races.map((r) => r.distance.toString()).join("")),
});

const dayFivePartTwoResults = (filename: string): number => {
  const acceleration = 1;
  return raceToAmountOfWinningPossibilities(
    mergeRaces(fileToRaces(filename)),
    acceleration
  );
};

const dayFivePartTwoTest = () => {
  const expected = 71503;
  const result = dayFivePartTwoResults("test-input-a");
  if (result !== expected)
    throw new Error(`Expected ${expected}, got ${result}.`);
  console.log("Test passed!");
};

dayFivePartTwoTest();
console.log("The result is: ", dayFivePartTwoResults("input"));
