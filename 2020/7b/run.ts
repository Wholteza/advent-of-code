import { BagColor, bagLexicon } from "./parsed-input";

const SHINY_GOLD = "shiny gold";

const countBagsInsideBag = (color: BagColor): boolean => {
  if (!bagLexicon[color] || !bagLexicon[color].length) return false;
  for (let bagColor of bagLexicon[color]) {
    if (isShinyGoldBag(bagColor)) return true;
  }
  return bagLexicon[color].some((c) => canHoldShinyGoldBag(c));
};

console.log(
  Object.keys(bagLexicon).reduce(
    (aggregate: number, currentColor: string): number =>
      canHoldShinyGoldBag(currentColor) ? aggregate + 1 : aggregate,
    0
  )
);
