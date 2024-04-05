import Player from '../src/player';
import Bot from '../src/bot';

test('player has proper name', () => {
  expect(new Player('Player1').name).toBe('Player1');
});

test('Bot has proper name', () => {
  expect(new Bot().name).toBe('Bot');
});

test('player can make a move', () => {
  expect(new Player('Kame').makeMove([0, 0])).toEqual([0, 0]);
});

test('throw an exception when trying to make the same move', () => {
  const player1 = new Player('Player1');
  player1.makeMove([0, 0]);
  expect(() => player1.makeMove([0, 0])).toThrow(
    "Can't play the same move twice",
  );
});

test('Bot can make a move', () => {
  const bot = new Bot();
  const randomMove = bot.getRandomValidMove();
  expect(bot.makeMove(randomMove)).toEqual(randomMove);
});

test('Bot place all ships on initialization', () => {
  const bot = new Bot();
  expect(bot.gameboard.isAllShipsPlaced()).toBeTruthy();
});
