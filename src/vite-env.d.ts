/// <reference types="vite/client" />

type AttackResult = 'hit' | 'miss' | `${ShipName} sunk`;

type Board = Array<Array<AttackResult | ShipName | ''>>;

type BoardName = 'player' | 'enemy';

type CoordPoint = [number, number];

type CoordPointKey = `[${CoordPoint}]`;

type Direction = 'up' | 'right' | 'down' | 'left';

type ShipName =
  | 'carrier'
  | 'battleship'
  | 'cruiser'
  | 'submarine'
  | 'destroyer';

type Ships = {
  [key in ShipName]: Ship;
};
