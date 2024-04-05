import Gameboard from './gameboard';

export default class Player {
  name: string;
  gameboard: Gameboard;
  moves: Set<CoordPointKey>;

  constructor(name: string) {
    this.name = name;
    this.gameboard = new Gameboard();
    this.moves = new Set();
  }

  makeMove(move: CoordPoint): CoordPoint {
    const key = JSON.stringify(move);
    if (this.moves.has(key)) {
      throw new Error("Can't play the same move twice");
    }
    this.moves.add(key);
    return move;
  }
}
