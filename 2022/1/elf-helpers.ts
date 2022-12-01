import { Elf } from "./types";

const ELF_BACKPACK_DELIMITER = "";

export const createElfsFromPuzzleInput = (backpackContentsSeparatedByNewline: string) => {
  var backpackContentsSeparatedByDelimiter = backpackContentsSeparatedByNewline.split("\r\n");
  const elfs = backpackContentsSeparatedByDelimiter.reduce<Elf[]>(
    (elfs, currentBackpackItem): Elf[] => {
      if (currentBackpackItem === ELF_BACKPACK_DELIMITER) 
        return [new Elf(), ...elfs];
      elfs[0].addCalories(+currentBackpackItem);
      return elfs;
    },
    [new Elf()]
  );
  return elfs;
};

export const getElfWithMostCalories = (elfs: Elf[]): Elf => {
  return elfs.reduce<Elf>((elfWithMostCalories, currentElf) => {
    const currentElfHasMoreCalories = currentElf.getTotalCalories() > elfWithMostCalories.getTotalCalories()
    if (currentElfHasMoreCalories) elfWithMostCalories = currentElf;
    return elfWithMostCalories;
  }, new Elf());
};

export const sortElfsByMostCalories = (elfs: Elf[]): Elf[] => elfs.sort((a, b) => a.getTotalCalories()-b.getTotalCalories()).reverse()