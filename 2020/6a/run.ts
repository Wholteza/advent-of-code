import { groups } from "./parsed-input";

console.log(
  groups.reduce(
    (aggregate: number, currentGroup: string): number =>
      aggregate + currentGroup.length,
    0
  )
);
