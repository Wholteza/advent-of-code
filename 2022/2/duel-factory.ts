import { DuelIdentifiers } from "./input-helpers";
import { PlayerFactory } from "./player-factory";
import { Player } from "./player";

type Duel = {
  opponent: Player;
  me: Player;
};

export class DuelFactory {
  private duelIdentifiers: DuelIdentifiers[];
  private duels: Duel[] = [];
  constructor(battleIdentifiers: DuelIdentifiers[]) {
    this.duelIdentifiers = battleIdentifiers;
  }

  public seedWithPlayersV1 = (): DuelFactory => {
    this.duels = this.duelIdentifiers.map<Duel>(
      ({ opponentIdentifier, myIdentifier }) => ({
        opponent: PlayerFactory.createOpponentV1(opponentIdentifier),
        me: PlayerFactory.createMyselfV1(myIdentifier),
      })
    );
    return this;
  };

  public seedWithPlayersV2 = (): DuelFactory => {
    this.duels = this.duelIdentifiers.map<Duel>(
      ({ opponentIdentifier, myIdentifier }) => ({
        opponent: PlayerFactory.createOpponentV2(opponentIdentifier),
        me: PlayerFactory.createMyselfV2(myIdentifier, opponentIdentifier),
      })
    );
    return this;
  };

  public calculateScore = (): number =>
    this.duels.reduce((totalScore, currentBattle) => {
      const { me, opponent } = currentBattle;
      return totalScore + me.getScoreFromDuelAgainst(opponent);
    }, 0);
}
