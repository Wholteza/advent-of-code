import { map } from "./parsed-input";

const TREE = "#";
const X_VELOCITY = 3;
const Y_VELOCITY = 1;

const getLoopedXPosition = (x: number) => x % map[0].length;

const treeWasHit = (x: number, y: number): boolean => map[y][x] === TREE;

const bottomOfSlope = map.length - 1;
let amountOfTreesHit = 0;
let xPos = 0;
let yPos = 0;

while (yPos <= bottomOfSlope) {
  treeWasHit(getLoopedXPosition(xPos), yPos) && amountOfTreesHit++;
  xPos += X_VELOCITY;
  yPos += Y_VELOCITY;
}

console.log(amountOfTreesHit);
