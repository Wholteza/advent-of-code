import { BoardingPassCode, boardingPassCodes } from "./parsed-input";

const ROW_TAKE_LOWER_IDENTIFIER = "F";
const COL_TAKE_LOWER_IDENTIFIER = "L";
const [minRow, maxRow, minCol, maxCol] = [0, 127, 0, 7];

const generateSequence = (min: number, max: number): number[] => {
  const sequence = [];
  for (let i = min; i < max + 1; i++) sequence.push(i);
  return sequence;
};

const takeLower = (value: number[]) =>
  value.slice(0, Math.floor(value.length / 2));

const takeHigher = (value: number[]) =>
  value.slice(Math.floor(value.length / 2));

const calculateRowOrColumn = (
  rowSequence: string[],
  seatMin: number,
  seatMax: number,
  takeLowerIdentifier: string
): number =>
  rowSequence.reduce<number[]>(
    (aggregate: number[], current: string): number[] =>
      current === takeLowerIdentifier
        ? takeLower(aggregate)
        : takeHigher(aggregate),
    generateSequence(seatMin, seatMax)
  )[0];

const getSeatId = (boardingPassCode: BoardingPassCode) => {
  const row = calculateRowOrColumn(
    boardingPassCode.rowSequence,
    minRow,
    maxRow,
    ROW_TAKE_LOWER_IDENTIFIER
  );
  const col = calculateRowOrColumn(
    boardingPassCode.columnSequence,
    minCol,
    maxCol,
    COL_TAKE_LOWER_IDENTIFIER
  );
  return row * 8 + col;
};

const isMySeat = (seatId: number, boardingPassSeatIds: number[]) => {
  const seat = boardingPassSeatIds.find((s) => s === seatId);
  if (seat !== undefined) return;
  const [seatIdAhead, seatIdBehind] = [
    boardingPassSeatIds.find((s) => s === seatId + 1),
    boardingPassSeatIds.find((s) => s === seatId - 1),
  ];
  return !!(seatIdAhead && seatIdBehind);
};

const boardingPassSeatIds = boardingPassCodes
  .map<number>((boardingPass) => getSeatId(boardingPass))
  .sort((a, b) => a - b);

generateSequence(
  boardingPassSeatIds[0],
  boardingPassSeatIds[boardingPassSeatIds.length - 1]
).every((seatId) => {
  if (!isMySeat(seatId, boardingPassSeatIds)) return true;
  console.log(seatId);
  return false;
});
