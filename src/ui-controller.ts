export function dragAndDrop(e: MouseEvent) {
  const tar = e.target;
  if (tar instanceof HTMLDivElement) {
    if (
      tar.classList.contains('carrier') ||
      tar.classList.contains('battleship') ||
      tar.classList.contains('cruiser') ||
      tar.classList.contains('submarine') ||
      tar.classList.contains('destroyer')
    ) {
      const clone = tar.cloneNode(true) as HTMLDivElement;
      clone.style.position = 'absolute';
      clone.style.zIndex = '1000';
      clone.style.transformOrigin = '20px 20px';
      document.body.append(clone);
      moveAt(e.pageX, e.pageY, clone);
      const rKeyPressHandler = createKeyPressHandler(clone);
      document.addEventListener('keydown', rKeyPressHandler);
      document.addEventListener('mousemove', handleMouseMove);
      clone.addEventListener('mouseup', (e) => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('keydown', rKeyPressHandler);
        clone.remove();
        const elementBelow = document.elementFromPoint(
          e.clientX,
          e.clientY,
        ) as HTMLDivElement;
        elementBelow.click();
      });
    }
  }
}

function createKeyPressHandler(tar: HTMLDivElement) {
  let dir: Direction = 'right';
  return function (e: KeyboardEvent) {
    if (e.key === 'r') {
      if (dir === 'right') {
        tar.style.rotate = '90deg';
        dir = 'down';
      } else if (dir === 'down') {
        tar.style.rotate = '180deg';
        dir = 'left';
      } else if (dir === 'left') {
        tar.style.rotate = '270deg';
        dir = 'up';
      } else {
        tar.style.rotate = '0deg';
        dir = 'right';
      }
    }
  };
}

function moveAt(pageX: number, pageY: number, tar: HTMLDivElement) {
  tar.style.left = `${pageX - 20}px`;
  tar.style.top = `${pageY - 20}px`;
}

function handleMouseMove(e: MouseEvent) {
  const tar = e.target;
  if (tar instanceof HTMLDivElement) {
    if (
      tar.classList.contains('carrier') ||
      tar.classList.contains('battleship') ||
      tar.classList.contains('cruiser') ||
      tar.classList.contains('submarine') ||
      tar.classList.contains('destroyer')
    ) {
      moveAt(e.pageX, e.pageY, tar);
    }
  }
}

export function readCoords(cellDiv: HTMLDivElement): CoordPoint {
  if (cellDiv.classList.contains('cell') && cellDiv.dataset.coords) {
    const coords = cellDiv.dataset.coords;
    return [parseInt(coords[0]), parseInt(coords[1])];
  }
  throw new Error('Invalid input: expect HTMLDivElement of class "cell"');
}

export function renderBoard(
  board: Board,
  target: HTMLDivElement,
  key: BoardName,
) {
  target.textContent = '';

  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');
      cellDiv.setAttribute('data-coords', `${i}${j}`);
      if (cell === 'miss') {
        cellDiv.classList.add('miss');
      } else if (cell === 'hit') {
        cellDiv.classList.add('hit');
      }

      if (key === 'player' && cell !== '' && cell !== 'miss') {
        cellDiv.classList.add('ship');
      }

      target.appendChild(cellDiv);
    });
  });
}
