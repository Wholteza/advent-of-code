import { HandShapes, Player } from "./player";

export class PlayerFactory {
  private static getOpponentShapeV1 = (identifier: string): HandShapes => {
    const handMap: { [Key: string]: HandShapes } = {
      A: HandShapes.Rock,
      B: HandShapes.Paper,
      C: HandShapes.Scissor,
    };
    return handMap[identifier];
  };

  private static getMyShapeV1 = (identifier: string): HandShapes => {
    const handMap: { [Key: string]: HandShapes } = {
      X: HandShapes.Rock,
      Y: HandShapes.Paper,
      Z: HandShapes.Scissor,
    };
    return handMap[identifier];
  };

  public static createOpponentV1 = (identifier: string) =>
    new Player(this.getOpponentShapeV1(identifier));

  public static createMyselfV1 = (identifier: string) =>
    new Player(this.getMyShapeV1(identifier));

  private static getMyShapeV2 = (
    myIdentifier: string,
    opponentIdentifier: string
  ): HandShapes => {
    const handMap: { [Key: string]: { [Key: string]: HandShapes } } = {
      A: {
        X: HandShapes.Scissor,
        Y: HandShapes.Rock,
        Z: HandShapes.Paper,
      },
      B: {
        X: HandShapes.Rock,
        Y: HandShapes.Paper,
        Z: HandShapes.Scissor,
      },
      C: {
        X: HandShapes.Paper,
        Y: HandShapes.Scissor,
        Z: HandShapes.Rock,
      },
    };
    return handMap[opponentIdentifier][myIdentifier];
  };

  public static createOpponentV2 = (identifier: string) =>
    PlayerFactory.createOpponentV1(identifier);

  public static createMyselfV2 = (
    identifier: string,
    opponentIdentifier: string
  ) => new Player(this.getMyShapeV2(identifier, opponentIdentifier));
}
