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

const sum = (powers: number[]) =>
  powers.reduce((sum, current) => sum + current, 0);

const calculatePowerOfGame = (gameData: GameData): number =>
  gameData.red * gameData.green * gameData.blue;

const toLowestPossibleAmount = (gameData: GameData[]) =>
  gameData.reduce<GameData>(
    (lowestGame, currentGame): GameData => {
      return {
        red: Math.max(lowestGame.red, currentGame.red),
        green: Math.max(lowestGame.green, currentGame.green),
        blue: Math.max(lowestGame.blue, currentGame.blue),
      };
    },
    {
      blue: 0,
      green: 0,
      red: 0,
    }
  );

const calculatePartTwoResultFromFile = (fileName: string): number =>
  sum(
    readRowsOfFile(fileName)
      .map(toNumberAndData)
      .map((game) => toStructuredData(game.gameData))
      .map(toLowestPossibleAmount)
      .map(calculatePowerOfGame)
  );

const runPartTwoTest = () => {
  const expected = 2286;
  const result = calculatePartTwoResultFromFile("test-input-a");
  if (result !== expected)
    throw new Error(`Expected ${expected}, got ${result}`);
  console.log("Test passed!");
};

runPartTwoTest();
console.log(`Result is: ${calculatePartTwoResultFromFile("input")}`);
