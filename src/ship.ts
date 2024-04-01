export default class Ship {
  #length: number;
  #hits: number;

  constructor(length: number) {
    this.#length = length;
    this.#hits = 0;
  }

  hit(): void {
    if (this.isSunk()) throw new Error("Can't hit sunken ship");
    this.#hits++;
  }

  isSunk(): boolean {
    return this.#hits === this.#length;
  }
}
