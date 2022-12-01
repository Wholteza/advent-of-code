import { readFileSync } from "fs";
import { createElfsFromPuzzleInput, getElfWithMostCalories, getSumOfElfs, sortElfsByMostCalories } from "./elf-helpers";

var text = readFileSync("./input", "utf-8");
const elfs = createElfsFromPuzzleInput(text);

const elfWithHighestCalorieValue = getElfWithMostCalories(elfs);
console.log("Answer #1: ", elfWithHighestCalorieValue.getTotalCalories());

const topThreeElfs = sortElfsByMostCalories(elfs).slice(0,3);
const sumOfTopThreeElfs = getSumOfElfs(topThreeElfs) 
console.log("Answer #2: ", sumOfTopThreeElfs)
