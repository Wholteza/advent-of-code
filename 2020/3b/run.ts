import { map } from "./parsed-input";

const TREE = "#";

const bottomOfSlope = map.length - 1;
const getLoopedXPosition = (x: number) => x % map[0].length;
const treeWasHit = (x: number, y: number): boolean => map[y][x] === TREE;
const getTreesHitForRoute = (xVelocity: number, yVelocity: number) => {
  let amountOfTreesHit = 0;
  let xPos = 0;
  let yPos = 0;
  while (yPos <= bottomOfSlope) {
    treeWasHit(getLoopedXPosition(xPos), yPos) && amountOfTreesHit++;
    xPos += xVelocity;
    yPos += yVelocity;
  }
  return amountOfTreesHit;
};

console.log(
  getTreesHitForRoute(1, 1) *
    getTreesHitForRoute(3, 1) *
    getTreesHitForRoute(5, 1) *
    getTreesHitForRoute(7, 1) *
    getTreesHitForRoute(1, 2)
);
