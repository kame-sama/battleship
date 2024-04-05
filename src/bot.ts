import Player from './player';

const BOARD_SIZE = 10;
const DIRECTION_LIST: Direction[] = ['up', 'right', 'down', 'left'];
const NAME_LENGTH_MAP = {
  carrier: 5,
  battleship: 4,
  cruiser: 3,
  submarine: 3,
  destroyer: 1,
} as const;

export default class Bot extends Player {
  #validMoves: CoordPointKey[];
  #shipsToPlace: ShipName[];
  #hits: CoordPoint[];
  #currentDirection: Direction | undefined;
  #successfulDirection: Direction | undefined;

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
    this.#hits = [];

    for (let row = 0; row < this.gameboard.board.length; row++) {
      for (let col = 0; col < this.gameboard.board.length; col++) {
        this.#validMoves.push(JSON.stringify([row, col]));
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
    while (this.#hits.length) {
      const [hitX, hitY] = this.#hits[this.#hits.length - 1];
      let coords: CoordPoint | undefined;

      if (this.#successfulDirection) {
        coords = this.#processCoordPointWithDirection(hitX, hitY);
        if (coords) return coords;
        this.#reverseChunk();
        this.#reverseDirection();
        coords = this.#processCoordPointWithDirection(hitX, hitY);
        if (coords) return coords;
      }

      coords = this.#processCoordPoint([hitX + 1, hitY]);
      this.#currentDirection = 'up';
      if (coords) return coords;

      coords = this.#processCoordPoint([hitX - 1, hitY]);
      this.#currentDirection = 'down';
      if (coords) return coords;

      coords = this.#processCoordPoint([hitX, hitY + 1]);
      this.#currentDirection = 'right';
      if (coords) return coords;

      coords = this.#processCoordPoint([hitX, hitY - 1]);
      this.#currentDirection = 'left';
      if (coords) return coords;

      this.#hits.pop();
    }

    const index = Math.floor(Math.random() * this.#validMoves.length);
    const move = this.#validMoves[index];
    this.#validMoves.splice(index, 1);
    return JSON.parse(move);
  }

  storeHit(coords: CoordPoint, attackResult: AttackResult) {
    if (attackResult === 'hit') {
      this.#hits.push(coords);
      if (this.#hits.length > 1) {
        this.#successfulDirection = this.#currentDirection;
      }
    } else if (
      attackResult === 'miss' &&
      this.#successfulDirection &&
      this.#hits.length
    ) {
      this.#reverseChunk();
      this.#reverseDirection();
    } else if (attackResult.includes('carrier')) {
      this.#cleanUpHits('carrier', coords);
      this.#successfulDirection = undefined;
    } else if (attackResult.includes('battleship')) {
      this.#cleanUpHits('battleship', coords);
      this.#successfulDirection = undefined;
    } else if (attackResult.includes('cruiser')) {
      this.#cleanUpHits('cruiser', coords);
      this.#successfulDirection = undefined;
    } else if (attackResult.includes('submarine')) {
      this.#cleanUpHits('submarine', coords);
      this.#successfulDirection = undefined;
    } else if (attackResult.includes('destroyer')) {
      this.#cleanUpHits('destroyer', coords);
      this.#successfulDirection = undefined;
    }
  }

  #cleanUpHits(shipName: ShipName, coords: CoordPoint) {
    const direction = this.#successfulDirection || this.#currentDirection;
    const coord = direction === 'up' || direction === 'down' ? 1 : 0;
    let count = NAME_LENGTH_MAP[shipName];
    let index = this.#hits.length - 1;

    while (count && index >= 0) {
      if (this.#hits[index][coord] === coords[coord]) {
        this.#hits.splice(index, 1);
        count--;
      }
      index--;
    }
  }

  #processCoordPoint(coords: CoordPoint): CoordPoint | undefined {
    const key: CoordPointKey = JSON.stringify(coords);
    let index: number;
    if (!this.moves.has(key)) {
      index = this.#validMoves.indexOf(key);
      if (index !== -1) {
        this.#validMoves.splice(index, 1);
        return coords;
      }
    }
  }

  #processCoordPointWithDirection(
    hitX: number,
    hitY: number,
  ): CoordPoint | undefined {
    switch (this.#successfulDirection) {
      case 'up':
        return this.#processCoordPoint([hitX + 1, hitY]);
      case 'down':
        return this.#processCoordPoint([hitX - 1, hitY]);
      case 'right':
        return this.#processCoordPoint([hitX, hitY + 1]);
      case 'left':
        return this.#processCoordPoint([hitX, hitY - 1]);
    }
  }

  #reverseChunk() {
    let chunk: CoordPoint[] = [];
    const n = this.#hits.length - 1;
    const direction = this.#successfulDirection || this.#currentDirection;
    const coord = direction === 'up' || direction === 'down' ? 1 : 0;
    const tarCoord = this.#hits[n][coord];

    for (let i = n; i >= 0; i--) {
      if (this.#hits[i][coord] !== tarCoord) {
        chunk = this.#hits.splice(i + 1, Infinity);
        this.#hits = this.#hits.concat(chunk);
      }
    }
  }

  #reverseDirection() {
    switch (this.#successfulDirection) {
      case 'up':
        this.#successfulDirection = 'down';
        break;
      case 'down':
        this.#successfulDirection = 'up';
        break;
      case 'right':
        this.#successfulDirection = 'left';
        break;
      case 'left':
        this.#successfulDirection = 'right';
        break;
    }
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
