import { readFileSync } from "fs";

type Elf = {
  itemsContentInCalories: number[];
  totalCalorieAmount: number;
};

const createElfsFromInput = (text: string) => {
  var elfContentSeparatedByNewline = text.split("\r\n");
  const elfs = elfContentSeparatedByNewline.reduce<Elf[]>(
    (agg, current): Elf[] => {
      const addNewElf = () =>
        (agg = [{ itemsContentInCalories: [], totalCalorieAmount: 0 }, ...agg]);
      if (!agg.length) addNewElf();
      if (current === "") {
        addNewElf();
        return agg;
      }
      const currentElf = agg[0];
      currentElf.itemsContentInCalories.push(+current);
      currentElf.totalCalorieAmount = currentElf.itemsContentInCalories.reduce(
        (agg, current) => {
          agg += current;
          return agg;
        },
        0
      );
      return agg;
    },
    []
  );
  return elfs;
};

const getElfWithHighestCalorieValue = (elfs: Elf[]): Elf | undefined => {
  return elfs.reduce<Elf | undefined>((agg, current) => {
    if (!agg) {
      agg = current;
      return agg;
    }
    if (current.totalCalorieAmount > agg.totalCalorieAmount) {
        agg = current;
        return agg;
    }
    return agg;
  }, undefined);
};

const sortSequenceOfNumbers = (numbers: number[]): number[] => numbers.sort((a, b) => a-b).reverse()


var text = readFileSync("./input", "utf-8");
const elfs = createElfsFromInput(text);

const elfWithHighestCalorieValue = getElfWithHighestCalorieValue(elfs);
console.log("Answer #1: ", elfWithHighestCalorieValue?.totalCalorieAmount);

const allTotalCalorieValues = elfs.map(e => e.totalCalorieAmount);
const sortedCalorieValues = sortSequenceOfNumbers(allTotalCalorieValues)
const [first, second, third, ...rest] = sortedCalorieValues;
const topThreeTotalCalorieCount = first + second + third;
console.log("Answer #2: ", topThreeTotalCalorieCount)
