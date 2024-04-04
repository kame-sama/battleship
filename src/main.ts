import Bot from './bot';
import Player from './player';
import UIController from './ui-controller';

const single: HTMLButtonElement = document.querySelector('#single-player')!;
// const multi: HTMLButtonElement = document.querySelector('#multi-player')!;
const message: HTMLDivElement = document.querySelector('#message')!;
const player: HTMLDivElement = document.querySelector('#player')!;
const enemy: HTMLDivElement = document.querySelector('#enemy')!;
const carrier: HTMLButtonElement = document.querySelector('#carrier')!;
const battleship: HTMLButtonElement = document.querySelector('#battleship')!;
const cruiser: HTMLButtonElement = document.querySelector('#cruiser')!;
const submarine: HTMLButtonElement = document.querySelector('#submarine')!;
const destroyer: HTMLButtonElement = document.querySelector('#destroyer')!;
const ready: HTMLButtonElement = document.querySelector('#ready')!;
const changeDir: HTMLButtonElement = document.querySelector('#change-dir')!;
const restart: HTMLButtonElement = document.querySelector('#restart')!;

const ui = new UIController({ player, enemy });

let mode: GameMode;
let player1: Player;
let player2: Bot | Player;
let isGameStarted = false;
let isGameOver = false;

single.addEventListener('click', () => {
  mode = 'single-player';
  player1 = new Player('Player 1');
  ui.renderPlayerBoard(player1.gameboard.board);
  player2 = new Bot();
  ui.renderEnemyBoard(player2.gameboard.board);
});

let shipName: ShipName | undefined;
let direction: Direction = 'up';

carrier.addEventListener('click', () => {
  shipName = 'carrier';
});

battleship.addEventListener('click', () => {
  shipName = 'battleship';
});

cruiser.addEventListener('click', () => {
  shipName = 'cruiser';
});

submarine.addEventListener('click', () => {
  shipName = 'submarine';
});

destroyer.addEventListener('click', () => {
  shipName = 'destroyer';
});

changeDir.addEventListener('click', () => {
  switch (changeDir.textContent) {
    case 'Up':
      changeDir.textContent = 'Right';
      direction = 'right';
      break;
    case 'Right':
      changeDir.textContent = 'Down';
      direction = 'down';
      break;
    case 'Down':
      changeDir.textContent = 'Left';
      direction = 'left';
      break;
    default:
      changeDir.textContent = 'Up';
      direction = 'up';
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'r') changeDir.click();
});

player.addEventListener('click', (e) => {
  if (isGameOver) return;
  if (e.target instanceof HTMLDivElement && shipName && direction) {
    const startingPoint = ui.readCoords(e.target);
    try {
      player1.gameboard.placeShip(shipName, startingPoint, direction);
      message.textContent = '';
      shipName = undefined;
      ui.renderPlayerBoard(player1.gameboard.board);
    } catch (error) {
      if (error instanceof Error) {
        message.textContent = error.message;
      }
    }
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
    ui.renderEnemyBoard(player2.gameboard.board);
    message.textContent = attackResult;
    player1.storeMove(coords, attackResult);

    if (player2.gameboard.isAllShipsSunk()) {
      message.textContent = 'Player 1 WINs';
      isGameStarted = false;
      isGameOver = true;
    }

    if (mode === 'single-player' && player2 instanceof Bot) {
      player1.gameboard.receiveAttack(
        player2.makeMove(player2.getRandomValidMove()),
      );
      ui.renderPlayerBoard(player1.gameboard.board);
      if (player1.gameboard.isAllShipsSunk()) {
        message.textContent = 'Bot WINs';
        isGameStarted = false;
        isGameOver = true;
      }
    }
  }
});

restart.addEventListener('click', () => {
  if (isGameOver) {
    isGameOver = false;
    player1 = new Player('Player 1');
    ui.renderPlayerBoard(player1.gameboard.board);
    player2 = new Bot();
    ui.renderEnemyBoard(player2.gameboard.board);
  }
});
