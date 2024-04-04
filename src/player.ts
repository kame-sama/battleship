import Gameboard from './gameboard';

export default class Player {
  name: string;
  gameboard: Gameboard;
  moves: Map<CoordPointKey, AttackResult>;

  constructor(name: string) {
    this.name = name;
    this.gameboard = new Gameboard();
    this.moves = new Map();
  }

  makeMove(move: CoordPoint): CoordPoint {
    const key = move.toString();
    if (this.moves.has(key)) {
      throw new Error("Can't play the same move twice");
    }

    return move;
  }

  storeMove(move: CoordPoint, attackResult: AttackResult): void {
    const key = move.toString();
    this.moves.set(key, attackResult);
  }
}
