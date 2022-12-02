export enum HandShapes {
  Rock = "Rock",
  Paper = "Paper",
  Scissor = "Scissor",
}

export enum DuelOutcome {
  Win = "Win",
  Loss = "Loss",
  Draw = "Draw",
}

type ShapeInfo = { [key in HandShapes]: number };

export class HandShape {
  private shape: HandShapes;
  private static values: ShapeInfo = {
    Rock: 1,
    Paper: 2,
    Scissor: 4,
  };
  private static winingSums: ShapeInfo = {
    Rock: HandShape.values.Rock + HandShape.values.Scissor,
    Paper: HandShape.values.Paper + HandShape.values.Rock,
    Scissor: HandShape.values.Scissor + HandShape.values.Paper,
  };
  private static scores: ShapeInfo = {
    Rock: 1,
    Paper: 2,
    Scissor: 3,
  };
  constructor(shape: HandShapes) {
    this.shape = shape;
  }

  private static getShapeValue = (shape: HandShapes): number =>
    HandShape.values[shape];

  private isWinningAgainst = (other: HandShape) =>
    HandShape.getShapeValue(this.shape) +
      HandShape.getShapeValue(other.shape) ===
    HandShape.winingSums[this.shape];
  private isDrawAgainst = (other: HandShape) => this.shape === other.shape;

  public getDuelOutcomeAgainst = (opponent: HandShape): DuelOutcome => {
    if (this.isWinningAgainst(opponent)) return DuelOutcome.Win;
    if (this.isDrawAgainst(opponent)) return DuelOutcome.Draw;
    return DuelOutcome.Loss;
  };

  getScore = () => HandShape.scores[this.shape];
}

export class Player {
  public handShape: HandShape;
  constructor(handShape: HandShapes) {
    this.handShape = new HandShape(handShape);
  }

  getScoreFromDuelAgainst = (opponent: Player): number => {
    const outcome = this.handShape.getDuelOutcomeAgainst(opponent.handShape);
    return new Score(outcome, this.handShape).getCalculatedScore();
  };
}

class Score {
  private static getScoreFor = (outcome: DuelOutcome) => {
    const outcomeScoreMap = {
      Loss: 0,
      Draw: 3,
      Win: 6,
    };
    return outcomeScoreMap[outcome];
  };
  private value: number;
  constructor(outcome: DuelOutcome, handShape: HandShape) {
    this.value = Score.getScoreFor(outcome) + handShape.getScore();
  }
  getCalculatedScore = () => this.value;
}
