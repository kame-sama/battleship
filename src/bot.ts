import Player from './player';

const BOARD_SIZE = 10;
const DIRECTION_LIST: Direction[] = ['up', 'right', 'down', 'left'];

export default class Bot extends Player {
  #validMoves: CoordPoint[];
  #shipsToPlace: ShipName[];

  constructor() {
    super('Bot');
    this.#validMoves = [];
    this.#shipsToPlace = [
      'destroyer',
      'submarine',
      'cruiser',
      'battleship',
      'carrier',
    ];

    for (let row = 0; row < this.gameboard.board.length; row++) {
      for (let col = 0; col < this.gameboard.board.length; col++) {
        this.#validMoves.push([row, col]);
      }
    }

    while (this.#shipsToPlace.length) {
      const shipName = this.#shipsToPlace.pop()!;
      let startingPoint = Bot.#getRandomStartingPoint();
      let direction = Bot.#getRandomDirection();

      while (
        this.gameboard.isOutOfBounds(shipName, startingPoint, direction) ||
        this.gameboard.isCollision(shipName, startingPoint, direction)
      ) {
        startingPoint = Bot.#getRandomStartingPoint();
        direction = Bot.#getRandomDirection();
      }

      this.gameboard.placeShip(shipName, startingPoint, direction);
    }
  }

  getRandomValidMove(): CoordPoint {
    const index = Math.floor(Math.random() * this.#validMoves.length);
    const move = this.#validMoves[index];
    this.#validMoves.splice(index, 1);
    return move;
  }

  static #getRandomDirection(): Direction {
    const index = Math.floor(Math.random() * DIRECTION_LIST.length);
    return DIRECTION_LIST[index];
  }

  static #getRandomStartingPoint(): CoordPoint {
    const row = Math.floor(Math.random() * BOARD_SIZE);
    const col = Math.floor(Math.random() * BOARD_SIZE);
    return [row, col];
  }
}
