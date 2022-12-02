import { readFileSync } from "fs";
import { DuelFactory } from "./duel-factory";
import { createDuelIdentifiersFromRawInput } from "./input-helpers";

var rawInput = readFileSync("./input", "utf-8");

var duelIdentifiers = createDuelIdentifiersFromRawInput(rawInput);
let totalScore = new DuelFactory(duelIdentifiers)
  .seedWithPlayersV1()
  .calculateScore();
console.log("Answer #1: ", totalScore);

totalScore = new DuelFactory(duelIdentifiers)
  .seedWithPlayersV2()
  .calculateScore();
console.log("Answer #2: ", totalScore);
