import { strictEqual } from "assert";
import fs from "fs";

const readRowsOfFile = (fileName: string): string[] =>
  fs
    .readFileSync(fileName, "utf-8")
    .split("\n")
    .filter((row) => !!row);

type Coordinates = { x: number; y: number };
type Square = { 1: Coordinates; 2: Coordinates; partNumber: number };
type Row = string[];
type Region = string[][];

const isSymbol = (coordinateValue: string) => /[^\d,.,]/.test(coordinateValue);

const containsSymbol = (region: Region): boolean =>
  region.some((row) => row.some(isSymbol));

const getRegionOfSquare = (
  square: Square,
  engineSchematicRows: Region
): Region => {
  const squareAdjusedForSchematicSize: Square = {
    ...square,
    1: { x: Math.max(square[1].x, 0), y: Math.max(square[1].y, 0) },
    2: {
      x: Math.min(square[2].x, engineSchematicRows[0].length - 1),
      y: Math.min(square[2].y, engineSchematicRows.length - 1),
    },
  };
  const squareYSize =
    squareAdjusedForSchematicSize[2].y - squareAdjusedForSchematicSize[1].y + 1;
  const region = new Array(squareYSize)
    .fill(0)
    .map((_, index): number => squareAdjusedForSchematicSize[1].y + index)
    .map(
      (absoluteY): Row =>
        engineSchematicRows[absoluteY].slice(
          squareAdjusedForSchematicSize[1].x,
          squareAdjusedForSchematicSize[2].x + 1
        )
    );
  return region;
};
const toSquareWithSurroundings = (square: Square): Square => {
  const squareWithSurroundings: Square = {
    ...square,
    "1": { x: square[1].x - 1, y: square[1].y - 1 },
    "2": { x: square[2].x + 1, y: square[2].y + 1 },
  };

  return squareWithSurroundings;
};

const identifyAreasOfPartNumbers = (
  row: string,
  rowIndex: number
): Square[] => {
  const squares: Square[] = [];
  for (let match of row.matchAll(/(\d+)/g)) {
    if (!match || match.index === undefined || !match[0])
      throw new Error("Could not find area of part number");
    squares.push({
      "1": { x: match.index, y: rowIndex },
      "2": { x: match.index + match[0].length - 1, y: rowIndex },
      partNumber: Number(match[0]),
    });
  }
  return squares;
};

const calculatePower = (power: number, currentSquare: Square): number =>
  power + currentSquare.partNumber;

const calculatePartOneResultFromFile = (fileName: string): number => {
  const engineSchematicAsRows = readRowsOfFile(fileName);
  const engineScematicAsRegion: Region = engineSchematicAsRows.map((r) =>
    r.split("")
  );
  return engineSchematicAsRows
    .flatMap(identifyAreasOfPartNumbers)
    .map(toSquareWithSurroundings)
    .map((square) => ({
      square,
      region: getRegionOfSquare(square, engineScematicAsRegion),
    }))
    .filter((squareAndRegion) => containsSymbol(squareAndRegion.region))
    .reduce<number>((sum, current) => calculatePower(sum, current.square), 0);
};

const runPartOneTest = () => {
  const expected = 4361;
  const result = calculatePartOneResultFromFile("test-input-a");
  if (result !== expected)
    throw new Error(`Expected ${expected}, got ${result}`);
  console.log("Test passed!");
};

runPartOneTest();
const result = calculatePartOneResultFromFile("input");
console.log(`Result is: ${result}`);
