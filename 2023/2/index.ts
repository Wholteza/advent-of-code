import fs from "fs";

const readRowsOfFile = (fileName: string): string[] =>
  fs
    .readFileSync(fileName, "utf-8")
    .split("\n")
    .filter((row) => !!row);

type GameData = { red: number; green: number; blue: number };
const toStructuredData = (gameData: string): GameData[] => {
  return gameData
    .split(";")
    .reduce<GameData[]>((acc, roundString): GameData[] => {
      const round = roundString
        .split(",")
        .map((value) => /(?<number>\d+) (?<color>.+)/.exec(value)?.groups ?? {})
        .reduce<GameData>(
          (roundData, group): GameData => {
            roundData[group["color"] as keyof GameData] = Number(
              group["number"] ?? 0
            );
            return roundData;
          },
          { green: 0, red: 0, blue: 0 }
        );
      return [...acc, round];
    }, []);
};

const toNumberAndData = (
  row: string
): { gameNumber: number; gameData: string } => {
  if (!row) throw new Error("Row is empty");
  const { gameData, gameNumber } =
    /Game (?<gameNumber>\d+): (?<gameData>.*)/g.exec(row)?.groups ?? {};
  return { gameData, gameNumber: Number(gameNumber) };
};

const calculatePartOneResultFromFile = (
  fileName: string,
  constraints: GameData
) =>
  readRowsOfFile(fileName)
    .map(toNumberAndData)
    .map((numberAndData) => ({
      number: numberAndData.gameNumber,
      rounds: toStructuredData(numberAndData.gameData),
    }))
    .reduce((sumOfGameNumbersMatchingConstraints, currentGame) => {
      const gameIsNotMatchingConstraint = currentGame.rounds.some(
        (round) =>
          round.red > constraints.red ||
          round.green > constraints.green ||
          round.blue > constraints.blue
      );
      return gameIsNotMatchingConstraint
        ? sumOfGameNumbersMatchingConstraints
        : sumOfGameNumbersMatchingConstraints + currentGame.number;
    }, 0);

const runPartOneTest = () => {
  const expected = 8;
  const result = calculatePartOneResultFromFile("test-input-a", {
    red: 12,
    green: 13,
    blue: 14,
  });
  if (result !== expected)
    throw new Error(`Expected ${expected}, got ${result}`);
  console.log("Test passed!");
};

runPartOneTest();
const result = calculatePartOneResultFromFile("input", {
  red: 12,
  green: 13,
  blue: 14,
});
console.log(`Result is: ${result}`);
