export default class UIController {
  uiElements: UIElements;

  constructor(uiElements: UIElements) {
    this.uiElements = uiElements;
  }

  readCoords(cellDiv: HTMLDivElement): CoordPoint {
    if (cellDiv.classList.contains('cell') && cellDiv.dataset.coords) {
      const coords = cellDiv.dataset.coords;
      return [parseInt(coords[0]), parseInt(coords[1])];
    }
    throw new Error('Invalid input: expect HTMLDivElement of class "cell"');
  }

  renderPlayerBoard(board: Board) {
    this.uiElements.player.textContent = '';

    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        cellDiv.setAttribute('data-coords', `${i}${j}`);
        if (cell !== '') {
          if (cell === 'miss') {
            cellDiv.classList.add('miss');
          } else {
            if (cell === 'hit') cellDiv.classList.add('hit');
            cellDiv.classList.add('ship');
          }
        }
        this.uiElements.player.appendChild(cellDiv);
      });
    });
  }

  renderEnemyBoard(board: Board) {
    this.uiElements.enemy.textContent = '';

    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        cellDiv.setAttribute('data-coords', `${i}${j}`);
        if (cell !== '') {
          if (cell === 'miss') {
            cellDiv.classList.add('miss');
          } else if (cell === 'hit') {
            cellDiv.classList.add('hit');
          }
        }
        this.uiElements.enemy.appendChild(cellDiv);
      });
    });
  }
}
