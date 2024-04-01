import Ship from '../src/ship';

test('brand new ship is not sunk', () => {
  const smallBoat = new Ship(1);
  expect(smallBoat.isSunk()).toBeFalsy();
});

test('ship of length 1 sinks after 1 hit', () => {
  const smallBoat = new Ship(1);
  smallBoat.hit();
  expect(smallBoat.isSunk()).toBeTruthy();
});

test('carrier sinks after 5 hits', () => {
  const carrierLength = 5;
  const carrier = new Ship(carrierLength);
  for (let i = 0; i < carrierLength; i++) {
    carrier.hit();
  }
  expect(carrier.isSunk()).toBeTruthy();
});

test('carrier is not sunk after 4 hits', () => {
  const carrierLength = 5;
  const carrier = new Ship(carrierLength);
  for (let i = 0; i < carrierLength - 1; i++) {
    carrier.hit();
  }
  expect(carrier.isSunk()).toBeFalsy();
});

test('throw an exception when trying to hit already sunken ship', () => {
  const smallBoat = new Ship(1);
  smallBoat.hit();
  expect(smallBoat.isSunk()).toBeTruthy();
  expect(() => smallBoat.hit()).toThrow("Can't hit sunken ship");
});
