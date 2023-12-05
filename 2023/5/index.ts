import fs from "fs";

class NumberMap {
  public name: string;
  public maps: { destination: number; source: number; range: number }[];
  constructor(unparsedMaps: string[]) {
    const [name, ...numbers] = unparsedMaps.filter((row) => !!row);
    this.name = name;
    this.maps = numbers
      .map((row) => Array.from(row.match(/(\d+)/g) ?? []))
      .map(([destination, source, range]) => [+destination, +source, +range])
      .map(([destination, source, range]) => ({ destination, source, range }));
  }

  public mapValue = (number: number) => {
    for (let i = 0; i < this.maps.length; i++) {
      const map = this.maps[i];
      const difference = number - map.source;
      const isNotWithinRange = difference < 0 || difference >= map.range;
      if (isNotWithinRange) continue;
      return map.destination + difference;
    }
    return number;
  };
}

const toSeedsV1 = (text: string | undefined): number[] => {
  if (!text || !text.includes("seeds"))
    throw new Error("Input does not contain seeds");
  return Array.from(text.match(/(\d+)/g) ?? []).map(Number);
};

const stepThroughAllMaps = (
  input: number,
  maps: NumberMap[]
): { input: number; output: number } => {
  let output = input;
  maps.forEach((m) => (output = m.mapValue(output)));
  return { input, output };
};

const readFileAsSeedsAndMapInput = (fileName: string) => {
  const fileText = fs.readFileSync(fileName, "utf-8");
  const rows = fileText.replace("\r\n", "\n").split("\n");
  const [unparsedSeeds, _emptyRow, ...rest] = rows;
  const inputGroupedByMaps = rest.reduce<string[][]>((maps, row) => {
    if (!row) return [...maps, []];
    const last = maps.pop() ?? [];
    last.push(row);
    return [...maps, last];
  }, []);
  return { unparsedSeeds, inputGroupedByMaps };
};

const getPartOneResult = (fileName: string): number => {
  const { inputGroupedByMaps, unparsedSeeds } =
    readFileAsSeedsAndMapInput(fileName);
  const seeds = toSeedsV1(unparsedSeeds);
  const maps = inputGroupedByMaps.map((rows) => new NumberMap(rows));
  const results = seeds.map((seed) => stepThroughAllMaps(seed, maps));
  const lowestOutputResult = results.reduce((closestLocation, current) =>
    current.output < (closestLocation?.output ?? Number.MAX_VALUE)
      ? current
      : closestLocation
  );
  return lowestOutputResult.output;
};

const runPartOneTest = () => {
  const expected = 35;
  const result = getPartOneResult("test-input-a");
  if (result !== expected)
    throw new Error(`Expected ${expected}, got ${result}`);
  console.log("Test passed!");
};

runPartOneTest();
let result = getPartOneResult("input");
console.log(`Result is: ${result}`);

class SeedV2 {
  public numbers: number[];
  constructor(number: number, range: number) {
    this.numbers = new Array(range)
      .fill(number)
      .map((value, index) => value + index);
  }
}
const toSeedsV2 = (text: string | undefined): SeedV2[] => {
  if (!text || !text.includes("seeds"))
    throw new Error("Input does not contain seeds");
  const numbers = Array.from(text.match(/(\d+)/g) ?? []).map(Number);
  const seeds: SeedV2[] = [];
  for (let i = 0; i < numbers.length; i += 2) {
    const [number, range] = [numbers[i], numbers[i + 1]];
    seeds.push(new SeedV2(number, range));
  }
  console.log(seeds);
  return seeds;
};

const getPartTwoResult = (fileName: string): number => {
  const { inputGroupedByMaps, unparsedSeeds } =
    readFileAsSeedsAndMapInput(fileName);
  const seeds = toSeedsV2(unparsedSeeds);
  const maps = inputGroupedByMaps.map((rows) => new NumberMap(rows));
  const lowestOutputResult = seeds.reduce<{
    input: number;
    output: number;
  } | null>((closestLocation, seed) => {
    const results = seed.numbers.map((n) => stepThroughAllMaps(n, maps));
    const lowestOutputResult = results.reduce((closestLocation, current) =>
      current.output < (closestLocation?.output ?? Number.MAX_VALUE)
        ? current
        : closestLocation
    );
    return lowestOutputResult.output <
      (closestLocation?.output ?? Number.MAX_VALUE)
      ? lowestOutputResult
      : closestLocation;
  }, null);
  return lowestOutputResult?.output ?? 0;
};

const runPartTwoTest = () => {
  const expected = 46;
  const result = getPartTwoResult("test-input-a");
  if (result !== expected)
    throw new Error(`Expected ${expected}, got ${result}`);
  console.log("Test passed!");
};

runPartTwoTest();
result = getPartTwoResult("input");
console.log(`Result is: ${result}`);
