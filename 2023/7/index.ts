import fs, { appendFile } from "fs";

const powerMap = {
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
type Card = keyof Omit<typeof powerMap, HandType>;
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

const toType = (hand: Hand): HandType => {
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

const byPower = (a: Hand, b: Hand): number => {
  const aType = toType(a);
  const bType = toType(b);
  const aPower = powerMap[aType];
  const bPower = powerMap[bType];
  const types = [aType, bType];
  if (types.every((type) => type === "High Card") || aType === bType) {
    for (let i = 0; i < 5; i++) {
      if (a.hand[i] === b.hand[i]) continue;
      return powerMap[a.hand[i]] > powerMap[b.hand[i]] ? 1 : -1;
    }
  }
  return aPower === bPower ? 0 : aPower > bPower ? 1 : -1;
};
// figure out their type
// compare hands
// give them ranks
// calculate score

const daySevenPartOneResults = (filename: string): number => {
  const hands = readHands(filename);
  const handsSortedByPower = hands.sort(byPower);
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
