import { readFileSync } from "fs";
import { createElfsFromPuzzleInput, getElfWithMostCalories, sortElfsByMostCalories } from "./elf-helpers";

var text = readFileSync("./input", "utf-8");
const elfs = createElfsFromPuzzleInput(text);

const elfWithHighestCalorieValue = getElfWithMostCalories(elfs);
console.log("Answer #1: ", elfWithHighestCalorieValue.getTotalCalories());

const [first, second, third] = sortElfsByMostCalories(elfs);
const sumOfTopThreeElfs = first.getTotalCalories() + second.getTotalCalories() + third.getTotalCalories();
console.log("Answer #2: ", sumOfTopThreeElfs)
