import Bot from './bot';
import Player from './player';
import * as ui from './ui-controller';

const player: HTMLDivElement = document.querySelector('#player')!;
const enemy: HTMLDivElement = document.querySelector('#enemy')!;
const message: HTMLDivElement = document.querySelector('#message')!;
const carrier: HTMLButtonElement = document.querySelector('#carrier')!;
const battleship: HTMLButtonElement = document.querySelector('#battleship')!;
const cruiser: HTMLButtonElement = document.querySelector('#cruiser')!;
const submarine: HTMLButtonElement = document.querySelector('#submarine')!;
const destroyer: HTMLButtonElement = document.querySelector('#destroyer')!;
const ready: HTMLButtonElement = document.querySelector('#ready')!;
const restart: HTMLButtonElement = document.querySelector('#restart')!;

let player1 = new Player('Player');
ui.renderBoard(player1.gameboard.board, player, 'player');
let player2 = new Bot();
ui.renderBoard(player2.gameboard.board, enemy, 'enemy');

let shipName: ShipName | undefined;
let direction: Direction = 'right';
let isGameStarted = false;
let isGameOver = false;

carrier.addEventListener('mousedown', ui.dragAndDrop);
battleship.addEventListener('mousedown', ui.dragAndDrop);
cruiser.addEventListener('mousedown', ui.dragAndDrop);
submarine.addEventListener('mousedown', ui.dragAndDrop);
destroyer.addEventListener('mousedown', ui.dragAndDrop);

carrier.addEventListener('mousedown', () => {
  shipName = 'carrier';
});

battleship.addEventListener('mousedown', () => {
  shipName = 'battleship';
});

cruiser.addEventListener('mousedown', () => {
  shipName = 'cruiser';
});

submarine.addEventListener('mousedown', () => {
  shipName = 'submarine';
});

destroyer.addEventListener('mousedown', () => {
  shipName = 'destroyer';
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'r') {
    switch (direction) {
      case 'right':
        direction = 'down';
        break;
      case 'down':
        direction = 'left';
        break;
      case 'left':
        direction = 'up';
        break;
      default:
        direction = 'right';
        break;
    }
  }
});

document.body.addEventListener('click', () => {
  shipName = undefined;
  direction = 'right';
});

player.addEventListener('click', (e) => {
  e.stopPropagation();
  if (isGameOver) return;
  if (e.target instanceof HTMLDivElement && shipName && direction) {
    const startingPoint = ui.readCoords(e.target);
    try {
      player1.gameboard.placeShip(shipName, startingPoint, direction);
      message.textContent = '';
      ui.renderBoard(player1.gameboard.board, player, 'player');
      if (shipName === 'carrier') {
        carrier.classList.add('placed');
      } else if (shipName === 'battleship') {
        battleship.classList.add('placed');
      } else if (shipName === 'cruiser') {
        cruiser.classList.add('placed');
      } else if (shipName === 'submarine') {
        submarine.classList.add('placed');
      } else if (shipName === 'destroyer') {
        destroyer.classList.add('placed');
      }
    } catch (error) {
      if (error instanceof Error) {
        message.textContent = error.message;
      }
    }

    shipName = undefined;
    direction = 'right';
  }
});

ready.addEventListener('click', () => {
  if (isGameOver) return;
  try {
    player1.gameboard.ready();
    isGameStarted = true;
    message.textContent = 'Game started';
  } catch (error) {
    if (error instanceof Error) {
      message.textContent = error.message;
    }
  }
});

enemy.addEventListener('click', (e) => {
  if (!isGameStarted) return;
  if (e.target instanceof HTMLDivElement) {
    const coords = ui.readCoords(e.target);
    try {
      player1.makeMove(coords);
      message.textContent = '';
    } catch (error) {
      if (error instanceof Error) {
        message.textContent = error.message;
        return;
      }
    }

    const attackResult = player2.gameboard.receiveAttack(coords);
    ui.renderBoard(player2.gameboard.board, enemy, 'enemy');
    message.textContent = attackResult;
    player1.storeMove(coords, attackResult);

    if (player2.gameboard.isAllShipsSunk()) {
      message.textContent = 'Player 1 WINs';
      isGameStarted = false;
      isGameOver = true;
    }

    player1.gameboard.receiveAttack(
      player2.makeMove(player2.getRandomValidMove()),
    );
    ui.renderBoard(player1.gameboard.board, player, 'player');
    if (player1.gameboard.isAllShipsSunk()) {
      message.textContent = 'Bot WINs';
      isGameStarted = false;
      isGameOver = true;
    }
  }
});

restart.addEventListener('click', () => {
  isGameOver = false;
  player1 = new Player('Player');
  ui.renderBoard(player1.gameboard.board, player, 'player');
  player2 = new Bot();
  ui.renderBoard(player2.gameboard.board, enemy, 'enemy');
});
