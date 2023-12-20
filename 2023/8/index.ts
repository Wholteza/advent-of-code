import { count } from "console";
import fs, { appendFile } from "fs";

const powerMapV1 = {
  "High Card": 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  7: 6,
  8: 7,
  9: 8,
  T: 9,
  J: 10,
  Q: 11,
  K: 12,
  A: 13,
  "One Pair": 14,
  "Two Pair": 15,
  "Three of a Kind": 16,
  "Full House": 17,
  "Four of a Kind": 18,
  "Five of a kind": 19,
} as const;

type HandType =
  | "High Card"
  | "One Pair"
  | "Two Pair"
  | "Three of a Kind"
  | "Full House"
  | "Four of a Kind"
  | "Five of a kind";
type Card = keyof Omit<typeof powerMapV1, HandType>;
type Cards = Card[];

type Hand = { bid: number; hand: Cards };
type Hands = Hand[];

// read hands
const readHands = (filename: string): Hands =>
  fs
    .readFileSync(filename, "utf8")
    .split("\n")
    .map((row) => {
      const { bid, hand } =
        /(?<hand>.{5}) (?<bid>\d+)/m.exec(row)?.groups ?? {};
      return { bid: +bid, hand: hand.split("") as Cards };
    });

const toTypeV1 = (hand: Hand): HandType => {
  const cardCountsRecord = hand.hand.reduce((acc, card) => {
    if (!acc[card]) {
      acc[card] = 1;
    } else {
      acc[card]++;
    }
    return acc;
  }, {} as Record<Card, number>);
  const cardCounts = Object.keys(cardCountsRecord).map((key) => ({
    card: key,
    count: cardCountsRecord[key as Card],
  }));
  if (cardCounts.some(({ count }) => count === 5)) return "Five of a kind";
  if (cardCounts.some(({ count }) => count === 4)) return "Four of a Kind";
  if (cardCounts.some(({ count }) => count === 3)) {
    if (cardCounts.some(({ count }) => count === 2)) return "Full House";
    return "Three of a Kind";
  }
  if (cardCounts.some(({ count }) => count === 2)) {
    if (cardCounts.filter(({ count }) => count === 2).length === 2)
      return "Two Pair";
    return "One Pair";
  }
  return "High Card";
};

const byPower = (
  a: Hand,
  b: Hand,
  map: typeof powerMapV1 | typeof powerMapV2,
  toHandType: (hand: Hand) => HandType
): number => {
  const aType = toHandType(a);
  const bType = toHandType(b);
  const aPower = map[aType];
  const bPower = map[bType];
  const types = [aType, bType];
  if (types.every((type) => type === "High Card") || aType === bType) {
    for (let i = 0; i < 5; i++) {
      if (a.hand[i] === b.hand[i]) continue;
      return map[a.hand[i]] > map[b.hand[i]] ? 1 : -1;
    }
  }
  return aPower === bPower ? 0 : aPower > bPower ? 1 : -1;
};

const daySevenPartOneResults = (filename: string): number => {
  const hands = readHands(filename);
  const handsSortedByPower = hands.sort((a, b) =>
    byPower(a, b, powerMapV1, toTypeV1)
  );
  const totalWinnings = handsSortedByPower.reduce(
    (acc, hand, index) => acc + hand.bid * (index + 1),
    0
  );
  return totalWinnings;
};

const daySevenPartOneTest = () => {
  const expected = 6440;
  const result = daySevenPartOneResults("test-input-a");
  if (result !== expected)
    throw new Error(`Expected ${expected}, got ${result}.`);
  console.log("Test passed!");
};

daySevenPartOneTest();
console.log("The result is: ", daySevenPartOneResults("input"));

const powerMapV2 = {
  "High Card": 0,
  J: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  T: 10,
  Q: 11,
  K: 12,
  A: 13,
  "One Pair": 14,
  "Two Pair": 15,
  "Three of a Kind": 16,
  "Full House": 17,
  "Four of a Kind": 18,
  "Five of a kind": 19,
} as const;

// Not proud of this one, but i have been stuck on this for a while and i want to move on :D
const toTypeV2 = (hand: Hand): HandType => {
  const cardCountsRecord = hand.hand.reduce((acc, card) => {
    if (acc[card]) {
      acc[card]++;
    } else {
      acc[card] = 1;
    }
    return acc;
  }, {} as Record<Card, number>);
  const jCount = cardCountsRecord.J ?? 0;
  const cardCounts = Object.keys(cardCountsRecord)
    .filter((key) => key !== "J")
    .map((key) => ({
      card: key,
      count: cardCountsRecord[key as Card],
    }));
  if (cardCounts.some(({ count }) => count === 5)) {
    return "Five of a kind";
  }
  if (cardCounts.some(({ count }) => count === 4)) {
    if (jCount === 1) return "Five of a kind";
    return "Four of a Kind";
  }
  if (cardCounts.some(({ count }) => count === 3)) {
    if (
      cardCounts.some(({ count }) => count === 2) &&
      cardCounts.some(({ count }) => count === 3)
    )
      return "Full House";
    if (jCount === 2) return "Five of a kind";
    if (jCount === 1) return "Four of a Kind";
    return "Three of a Kind";
  }
  if (cardCounts.some(({ count }) => count === 2)) {
    if (cardCounts.filter(({ count }) => count === 2).length === 2) {
      if (jCount === 1) return "Full House";
      return "Two Pair";
    }
    if (jCount === 3) return "Five of a kind";
    if (jCount === 2) return "Four of a Kind";
    if (jCount === 1) {
      if (new Set(cardCounts.map(({ card }) => card)).size === 2)
        return "Full House";
      return "Three of a Kind";
    }
    return "One Pair";
  }
  if (jCount === 5) return "Five of a kind";
  if (jCount === 4) return "Five of a kind";
  if (jCount === 3) return "Four of a Kind";
  if (jCount === 2) return "Three of a Kind";
  if (jCount === 1) return "One Pair";
  return "High Card";
};

const daySevenPartTwoResults = (filename: string): number => {
  const hands = readHands(filename);
  const handsSortedByPower = hands.sort((a, b) =>
    byPower(a, b, powerMapV2, toTypeV2)
  );
  const totalWinnings = handsSortedByPower.reduce(
    (acc, hand, index) => acc + hand.bid * (index + 1),
    0
  );
  return totalWinnings;
};

const daySevenPartTwoTest = () => {
  const expected = 5905;
  const result = daySevenPartTwoResults("test-input-a");
  if (result !== expected)
    throw new Error(`Expected ${expected}, got ${result}.`);
  console.log("Test passed!");
};

daySevenPartTwoTest();
console.log("The result is: ", daySevenPartTwoResults("input"));
