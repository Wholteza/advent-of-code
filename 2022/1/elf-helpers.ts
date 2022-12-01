import { Elf } from "./types";

const ELF_BACKPACK_DELIMITER = "";

export const createElfsFromPuzzleInput = (backpackContentsSeparatedByNewline: string) => {
  var backpackContentsSeparatedByDelimiter = backpackContentsSeparatedByNewline.split("\r\n");
  const elfs = backpackContentsSeparatedByDelimiter.reduce<Elf[]>(
    (elfs, currentBackpackItem): Elf[] => {
      const startCreatingNextElf = () =>
        (elfs = [new Elf(), ...elfs]);
      if (!elfs.length) startCreatingNextElf();
      if (currentBackpackItem === ELF_BACKPACK_DELIMITER) {
        startCreatingNextElf();
        return elfs;
      }
      const currentElf = elfs[0];
      currentElf.addCalories(+currentBackpackItem);
      return elfs;
    },
    []
  );
  return elfs;
};

export const getElfWithMostCalories = (elfs: Elf[]): Elf | undefined => {
  return elfs.reduce<Elf>((elfWithMostCalories, currentElf) => {
    const currentElfHasMoreCalories = currentElf.getTotalCalories() > elfWithMostCalories.getTotalCalories()
    if (currentElfHasMoreCalories) elfWithMostCalories = currentElf;
    return elfWithMostCalories;
  }, new Elf());
};

export const sortElfsByMostCalories = (elfs: Elf[]): Elf[] => elfs.sort((a, b) => a.getTotalCalories()-b.getTotalCalories()).reverse()