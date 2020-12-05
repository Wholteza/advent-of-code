import fs from "fs";

const TREE = "#";
const FREE = ".";
const EMPTY = "";
const SPLIT_REGEX = /(#|.)/;
const X_VELOCITY = 1;
const Y_VELOCITY = 3;

const rawInput: string = fs.readFileSync("raw.txt", "utf-8");
const input: string[] = rawInput.split("\n");
const map: string[][] = input.map((row) =>
  row
    .split(SPLIT_REGEX)
    .reduce<string[]>(
      (aggregate: string[], current: string): string[] =>
        current === EMPTY ? aggregate : [...aggregate, current],
      []
    )
);

const mountainYMax = map.length - 1;
const mountainXMax = map[0].length - 1;

const isNearTree = (x, y): boolean => {
  const mapX = x % mountainXMax;
  const leftIsTree = map[y][mapX === 0 ? mapX : mapX + 1] === TREE;
  const rightIsTree = map[y][mapX + 1] === TREE;
  return leftIsTree || rightIsTree;
};

let amountOfTreePasses = 0;
let meXPos = 0;
let meYPos = 0;

while (meYPos <= mountainYMax) {
  isNearTree(meXPos, meYPos) && amountOfTreePasses++;
  meXPos += X_VELOCITY;
  meYPos += Y_VELOCITY;
}

console.log(amountOfTreePasses);
