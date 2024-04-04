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
  #isReady: boolean;
  #ships: Ships;
  #shipCoordMap: Map<ShipName, CoordPoint[]>;
  #shipsSunk: number;

  constructor() {
    this.board = Gameboard.#initializeBoard();
    this.#isReady = false;
    this.#ships = Gameboard.#initializeShips();
    this.#shipCoordMap = new Map();
    this.#shipsSunk = 0;
  }

  isAllShipsPlaced(): boolean {
    return this.#shipCoordMap.size === 5;
  }

  isAllShipsSunk(): boolean {
    return this.#shipsSunk === 5;
  }

  isCollision(
    shipName: ShipName,
    startingPoint: CoordPoint,
    direction: Direction,
  ): boolean {
    let [row, col] = startingPoint;

    for (let i = 0; i < NAME_LENGTH_MAP[shipName]; i++) {
      if (this.board[row][col] !== '' && this.board[row][col] !== shipName) {
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

  isOutOfBounds(
    shipName: ShipName,
    startingPoint: CoordPoint,
    direction: Direction,
  ): boolean {
    let [row, col] = startingPoint;

    if (direction === 'up') {
      row -= NAME_LENGTH_MAP[shipName] - 1;
    } else if (direction === 'right') {
      col += NAME_LENGTH_MAP[shipName] - 1;
    } else if (direction === 'down') {
      row += NAME_LENGTH_MAP[shipName] - 1;
    } else {
      col -= NAME_LENGTH_MAP[shipName] - 1;
    }

    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
      return true;
    }

    return false;
  }

  placeShip(
    shipName: ShipName,
    startingPoint: CoordPoint,
    direction: Direction,
  ): Gameboard {
    if (this.#isReady) {
      throw new Error("Can't move ships at this game stage");
    }

    if (this.isOutOfBounds(shipName, startingPoint, direction)) {
      throw new Error('Invalid placement: Got out of bound');
    }

    if (this.isCollision(shipName, startingPoint, direction)) {
      throw new Error('Invalid placement: Collision ocurred');
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

  ready(): Gameboard {
    if (!this.isAllShipsPlaced()) {
      throw new Error('Should place all ships before game start');
    }
    this.#isReady = true;
    return this;
  }

  static #initializeBoard(): Board {
    return new Array(BOARD_SIZE)
      .fill('')
      .map(() => new Array(BOARD_SIZE).fill(''));
  }

  static #initializeShips(): Ships {
    const ships = {} as Ships;

    for (const [shipName, shipLength] of Object.entries(NAME_LENGTH_MAP)) {
      ships[shipName as ShipName] = new Ship(shipLength);
    }

    return ships;
  }
}
