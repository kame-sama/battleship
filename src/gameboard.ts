import Ship from './ship';

const BOARD_SIZE = 10;
const NAME_LENGTH_MAP = {
  carrier: 5,
  battleship: 4,
  cruiser: 3,
  submarine: 3,
  destroyer: 1,
} as const;

export default class Gameboard {
  board: Board;
  #ships: Ships;
  #shipCoordMap: Map<ShipName, CoordPoint[]>;
  #shipsSunk: number;

  constructor() {
    this.board = Gameboard.#createEmptyBoard();
    this.#ships = Gameboard.#createShipsObject();
    this.#shipCoordMap = new Map();
    this.#shipsSunk = 0;
  }

  isAllShipsPlaced(): boolean {
    return this.#shipCoordMap.size === 5;
  }

  isAllShipsSunk(): boolean {
    return this.#shipsSunk === 5;
  }

  isCollisionOrBreakOut(
    shipName: ShipName,
    startingPoint: CoordPoint,
    direction: Direction,
  ): boolean {
    let [row, col] = startingPoint;

    for (let i = 0; i < NAME_LENGTH_MAP[shipName]; i++) {
      if (
        row > BOARD_SIZE - 1 ||
        row < 0 ||
        col > BOARD_SIZE - 1 ||
        col < 0 ||
        (this.board[row][col] !== '' && this.board[row][col] !== shipName)
      ) {
        return true;
      }

      if (direction === 'up') {
        row--;
      } else if (direction === 'right') {
        col++;
      } else if (direction === 'down') {
        row++;
      } else {
        col--;
      }
    }

    return false;
  }

  placeShip(
    shipName: ShipName,
    startingPoint: CoordPoint,
    direction: Direction,
  ): Gameboard {
    if (this.isCollisionOrBreakOut(shipName, startingPoint, direction)) {
      throw new Error('Collision ocurred');
    }

    if (this.#shipCoordMap.has(shipName)) {
      const coords = this.#shipCoordMap.get(shipName)!;

      for (const [row, col] of coords) {
        this.board[row][col] = '';
      }
    }

    const coords: CoordPoint[] = [];
    let [row, col] = startingPoint;

    for (let i = 0; i < NAME_LENGTH_MAP[shipName]; i++) {
      if (direction === 'up') {
        this.board[row][col] = shipName;
        coords.push([row, col]);
        row--;
      } else if (direction === 'right') {
        this.board[row][col] = shipName;
        coords.push([row, col]);
        col++;
      } else if (direction === 'down') {
        this.board[row][col] = shipName;
        coords.push([row, col]);
        row++;
      } else {
        this.board[row][col] = shipName;
        coords.push([row, col]);
        col--;
      }
    }

    this.#shipCoordMap.set(shipName, coords);

    return this;
  }

  receiveAttack([row, col]: CoordPoint): AttackResult {
    if (this.board[row][col] === '') {
      this.board[row][col] = 'miss';
      return 'miss';
    }

    const shipName = this.board[row][col] as ShipName;
    this.#ships[shipName].hit();
    this.board[row][col] = 'hit';
    if (this.#ships[shipName].isSunk()) {
      this.#shipsSunk++;
      return 'sunk';
    }

    return 'hit';
  }

  static #createEmptyBoard(): Board {
    return new Array(BOARD_SIZE)
      .fill('')
      .map(() => new Array(BOARD_SIZE).fill(''));
  }

  static #createShipsObject(): Ships {
    const ships = {} as Ships;

    for (const [shipName, shipLength] of Object.entries(NAME_LENGTH_MAP)) {
      ships[shipName as ShipName] = new Ship(shipLength);
    }

    return ships;
  }
}
