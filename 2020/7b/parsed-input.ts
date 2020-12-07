import fs from "fs";

export type BagColor = string;

export type BagDefinition = [BagColor, BagColor[]];

export type BagLexicon = { [key: string]: BagColor[] };

const SINGLE_LINEBREAK = "\n";
const BAG_HEADER_SEPARATOR = " bags contain ";
const BAG_BODY_SEPARATOR = ", ";
const DEFINITION_ENDING = ".";
const EMPTY = "";
const CONTAINS_NO_BAGS_SELECTOR = "no other bags.";
const BAG_QUANTITY_FLUFF = /([0-9]{1,} )/;
const BAG_TEXT_FLUFF = /( bags| bag)/;

const rawInput: string = fs.readFileSync("input", "utf-8");

const groupByBagDefinition = (value: string): string[] =>
  value.split(SINGLE_LINEBREAK);

const createBagDefinitions = (group: string) => {
  const [header, rest] = [
    group.slice(0, group.indexOf(BAG_HEADER_SEPARATOR)),
    group.slice(
      group.indexOf(BAG_HEADER_SEPARATOR) + BAG_HEADER_SEPARATOR.length
    ),
  ];
  if (rest === CONTAINS_NO_BAGS_SELECTOR) return [header, []];
  var body = rest
    .replace(DEFINITION_ENDING, EMPTY)
    .split(BAG_BODY_SEPARATOR)
    .map((d) =>
      d.replace(BAG_QUANTITY_FLUFF, EMPTY).replace(BAG_TEXT_FLUFF, EMPTY)
    );
  return [header, body];
};

export const bagLexicon = groupByBagDefinition(rawInput)
  .map(createBagDefinitions)
  .reduce(
    (aggregate: BagLexicon, currentDefinition: BagDefinition): BagLexicon => {
      const [key, definition] = currentDefinition;
      return aggregate[key] ? aggregate : { ...aggregate, [key]: definition };
    },
    {}
  );
