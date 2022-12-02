export type DuelIdentifiers = {
  opponentIdentifier: string;
  myIdentifier: string;
};

export const createDuelIdentifiersFromRawInput = (rawInput: string) =>
  rawInput
    .split("\r\n")
    .map((i) => i.split(" "))
    .map<DuelIdentifiers>(([opponentIdentifier, myIdentifier]) => ({
      opponentIdentifier,
      myIdentifier,
    }));
