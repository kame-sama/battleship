import Gameboard from '../src/gameboard';

test('place carrier on empty board heading right', () => {
  const playerBoard = new Gameboard();
  const expectedBoard = new Gameboard().board;

  for (let i = 0; i < 5; i++) {
    expectedBoard[0][i] = 'carrier';
  }

  expect(playerBoard.placeShip('carrier', [0, 0], 'right').board).toEqual(
    expectedBoard,
  );
});

test('place battleship on empty board heading down', () => {
  const playerBoard = new Gameboard();
  const expectedBoard = new Gameboard().board;

  for (let i = 0; i < 4; i++) {
    expectedBoard[i][0] = 'battleship';
  }

  expect(playerBoard.placeShip('battleship', [0, 0], 'down').board).toEqual(
    expectedBoard,
  );
});

test('place cruiser on empty board heading left', () => {
  const playerBoard = new Gameboard();
  const expectedBoard = new Gameboard().board;

  for (let i = 9; i > 6; i--) {
    expectedBoard[0][i] = 'cruiser';
  }

  expect(playerBoard.placeShip('cruiser', [0, 9], 'left').board).toEqual(
    expectedBoard,
  );
});

test('place submarine on empty board heading up', () => {
  const playerBoard = new Gameboard();
  const expectedBoard = new Gameboard().board;

  for (let i = 9; i > 6; i--) {
    expectedBoard[i][0] = 'submarine';
  }

  expect(playerBoard.placeShip('submarine', [9, 0], 'up').board).toEqual(
    expectedBoard,
  );
});

test('throw an exception when ships fully overlap', () => {
  const playerBoard = new Gameboard();
  playerBoard.placeShip('carrier', [0, 0], 'right');
  expect(() => playerBoard.placeShip('battleship', [0, 0], 'right')).toThrow(
    'Invalid placement: Collision ocurred',
  );
});

test('throw an exception when ships overlap', () => {
  const playerBoard = new Gameboard();
  playerBoard.placeShip('carrier', [0, 0], 'right');
  expect(() => playerBoard.placeShip('battleship', [3, 0], 'up')).toThrow(
    'Invalid placement: Collision ocurred',
  );
});

test('throw an exception when ship gets out of board', () => {
  const playerBoard = new Gameboard();
  expect(() => playerBoard.placeShip('carrier', [0, 0], 'up')).toThrow(
    'Invalid placement: Out of bounds',
  );
});

test('correctly replace carrier', () => {
  const playerBoard = new Gameboard().placeShip('carrier', [0, 0], 'right');
  const expectedBoard = new Gameboard().placeShip(
    'carrier',
    [9, 0],
    'right',
  ).board;
  expect(playerBoard.placeShip('carrier', [9, 0], 'right').board).toEqual(
    expectedBoard,
  );
});

test('correctly replace carrier when new and old positions overlap', () => {
  const playerBoard = new Gameboard().placeShip('carrier', [0, 0], 'right');
  const expectedBoard = new Gameboard().placeShip(
    'carrier',
    [0, 3],
    'right',
  ).board;
  expect(playerBoard.placeShip('carrier', [0, 3], 'right').board).toEqual(
    expectedBoard,
  );
});

test('handles miss correctly', () => {
  const playerBoard = new Gameboard().placeShip('carrier', [0, 0], 'right');
  expect(playerBoard.receiveAttack([9, 9])).toBe('miss');
});

test('handles hit properly', () => {
  const playerBoard = new Gameboard().placeShip('carrier', [0, 0], 'right');
  expect(playerBoard.receiveAttack([0, 0])).toBe('hit');
});

test('handles multiple hits', () => {
  const playerBoard = new Gameboard().placeShip('carrier', [0, 0], 'right');
  expect(playerBoard.receiveAttack([0, 0])).toBe('hit');
  expect(playerBoard.receiveAttack([0, 1])).toBe('hit');
  expect(playerBoard.receiveAttack([0, 2])).toBe('hit');
});

test('handles destroyer sunk', () => {
  const playerBoard = new Gameboard().placeShip('destroyer', [0, 0], 'right');
  expect(playerBoard.receiveAttack([0, 0])).toBe('destroyer sunk');
});

test('handles carrier sunk', () => {
  const playerBoard = new Gameboard().placeShip('carrier', [0, 0], 'right');
  expect(playerBoard.receiveAttack([0, 0])).toBe('hit');
  expect(playerBoard.receiveAttack([0, 1])).toBe('hit');
  expect(playerBoard.receiveAttack([0, 2])).toBe('hit');
  expect(playerBoard.receiveAttack([0, 3])).toBe('hit');
  expect(playerBoard.receiveAttack([0, 4])).toBe('carrier sunk');
});

test('truthy when all ships are sunk', () => {
  const playerBoard = new Gameboard();
  playerBoard.placeShip('carrier', [0, 0], 'right');
  playerBoard.placeShip('battleship', [1, 0], 'right');
  playerBoard.placeShip('cruiser', [2, 0], 'right');
  playerBoard.placeShip('submarine', [3, 0], 'right');
  playerBoard.placeShip('destroyer', [4, 0], 'right');

  for (let row = 0; row < playerBoard.board.length; row++) {
    for (let col = 0; col < playerBoard.board.length; col++) {
      if (playerBoard.board[row][col] !== '') {
        playerBoard.receiveAttack([row, col]);
      }
    }
  }

  expect(playerBoard.isAllShipsSunk()).toBeTruthy();
});

test('falsy when there are ships left', () => {
  const playerBoard = new Gameboard();
  playerBoard.placeShip('carrier', [0, 0], 'right');
  playerBoard.placeShip('battleship', [1, 0], 'right');
  playerBoard.placeShip('cruiser', [2, 0], 'right');
  playerBoard.placeShip('submarine', [3, 0], 'right');
  playerBoard.placeShip('destroyer', [4, 0], 'right');
  expect(playerBoard.isAllShipsSunk()).toBeFalsy();
});

test('truthy when all ships are placed', () => {
  const playerBoard = new Gameboard();
  playerBoard.placeShip('carrier', [0, 0], 'right');
  playerBoard.placeShip('battleship', [1, 0], 'right');
  playerBoard.placeShip('cruiser', [2, 0], 'right');
  playerBoard.placeShip('submarine', [3, 0], 'right');
  playerBoard.placeShip('destroyer', [4, 0], 'right');
  expect(playerBoard.isAllShipsPlaced()).toBeTruthy();
});

test('falsy when not all ships are placed', () => {
  const playerBoard = new Gameboard();
  playerBoard.placeShip('carrier', [0, 0], 'right');
  expect(playerBoard.isAllShipsPlaced()).toBeFalsy();
});

test('do not able to say ready when not all ships are placed', () => {
  const playerBoard = new Gameboard();
  playerBoard.placeShip('carrier', [0, 0], 'right');
  expect(() => playerBoard.ready()).toThrow(
    'Should place all ships before game start',
  );
});

test('able to say ready when all ships are placed', () => {
  const playerBoard = new Gameboard();
  playerBoard.placeShip('carrier', [0, 0], 'right');
  playerBoard.placeShip('battleship', [1, 0], 'right');
  playerBoard.placeShip('cruiser', [2, 0], 'right');
  playerBoard.placeShip('submarine', [3, 0], 'right');
  playerBoard.placeShip('destroyer', [4, 0], 'right');
  expect(playerBoard.ready()).toEqual(playerBoard);
});

test('do not able to move ships when game is started', () => {
  const playerBoard = new Gameboard();
  playerBoard.placeShip('carrier', [0, 0], 'right');
  playerBoard.placeShip('battleship', [1, 0], 'right');
  playerBoard.placeShip('cruiser', [2, 0], 'right');
  playerBoard.placeShip('submarine', [3, 0], 'right');
  playerBoard.placeShip('destroyer', [4, 0], 'right');
  playerBoard.ready();
  expect(() => playerBoard.placeShip('destroyer', [5, 0], 'up')).toThrow(
    "Can't move ships at this game stage",
  );
});
