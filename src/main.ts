import '../assets/styles.css';
import Bot from './bot';
import Player from './player';
import * as ui from './ui-controller';

const player: HTMLDivElement = document.querySelector('#player')!;
const enemy: HTMLDivElement = document.querySelector('#enemy')!;
const message: HTMLDivElement = document.querySelector('#message')!;
const carrier: HTMLButtonElement = document.querySelector('.carrier')!;
const battleship: HTMLButtonElement = document.querySelector('.battleship')!;
const cruiser: HTMLButtonElement = document.querySelector('.cruiser')!;
const submarine: HTMLButtonElement = document.querySelector('.submarine')!;
const destroyer: HTMLButtonElement = document.querySelector('.destroyer')!;
const start: HTMLButtonElement = document.querySelector('#start')!;
const restart: HTMLButtonElement = document.querySelector('#restart')!;

const logMessage = ui.createMessageLogger(message);

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
        logMessage(error.message);
      }
    }

    shipName = undefined;
    direction = 'right';
  }
});

start.addEventListener('click', () => {
  if (isGameOver) return;
  try {
    player1.gameboard.ready();
    isGameStarted = true;
    message.innerHTML = '';
    logMessage('Game started');
    start.toggleAttribute('disabled');
  } catch (error) {
    if (error instanceof Error) {
      logMessage(error.message);
    }
  }
});

enemy.addEventListener('click', (e) => {
  if (!isGameStarted) return;
  if (e.target instanceof HTMLDivElement) {
    const coords = ui.readCoords(e.target);
    try {
      player1.makeMove(coords);
    } catch (error) {
      if (error instanceof Error) {
        logMessage(error.message);
        return;
      }
    }

    let attackResult = player2.gameboard.receiveAttack(coords);
    ui.renderBoard(player2.gameboard.board, enemy, 'enemy');
    if (attackResult === 'hit' || attackResult === 'miss') {
      logMessage(
        `<span style="color: var(--var-ship-clr)">
          Player:
        </span>
        ${attackResult}`,
      );
    } else {
      logMessage(
        `<span style="color: var(--var-edge-clr)">
          Bot's ${attackResult}
        </span>`,
      );
    }

    player1.storeMove(coords, attackResult);

    if (player2.gameboard.isAllShipsSunk()) {
      logMessage(
        `<span style="color: var(--var-ship-clr)">
          Player WINS!
        </span>`,
      );
      isGameStarted = false;
      isGameOver = true;
      return;
    }

    attackResult = player1.gameboard.receiveAttack(
      player2.makeMove(player2.getRandomValidMove()),
    );
    ui.renderBoard(player1.gameboard.board, player, 'player');
    if (attackResult === 'hit' || attackResult === 'miss') {
      logMessage(
        `<span style="color: var(--var-neutral-clr)">
          Bot:
        </span>
        ${attackResult}`,
      );
    } else {
      logMessage(
        `<span style="color: var(--var-edge-clr)">
          Player's ${attackResult}
        </span>`,
      );
    }

    if (player1.gameboard.isAllShipsSunk()) {
      logMessage(
        `<span style="color: var(--var-neutral-clr)">
          Bot WINS!
        </span>`,
      );
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
  message.innerHTML = '';
  if (start.disabled) {
    start.toggleAttribute('disabled');
  }
  carrier.classList.remove('placed');
  battleship.classList.remove('placed');
  cruiser.classList.remove('placed');
  submarine.classList.remove('placed');
  destroyer.classList.remove('placed');
});
