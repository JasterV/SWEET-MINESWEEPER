export function createCell(row, col) {
  let cellContainer = document.createElement("div");
  cellContainer.classList.add("cell");

  return {
    row,

    col,

    get type() {
      return cellContainer.getAttribute("data-celltype");
    },

    set type(newContent) {
      cellContainer.setAttribute("data-celltype", newContent);
    },

    get asHtmlElement() {
      return cellContainer;
    },

    hide() {
      cellContainer.classList.remove("discovered");
    },

    discover() {
      cellContainer.classList.add("discovered");
      cellContainer.classList.remove("flag-cell");
    },

    isHidden() {
      return !cellContainer.classList.contains("discovered");
    },

    toggleFlag() {
      cellContainer.classList.toggle("flag-cell");
    },

    manhattanDistance(other) {
      return Math.abs(row - other.row) + Math.abs(col - other.col);
    },

    perpendicularTo(other) {
      return row === other.row || col === other.col;
    }
  };
}

export function generateNRandomCells(n, min, max) {
  let cells = [];
  for (let i = 0; i < n; i++) {
    let newCell = generateRandomLocatedCell(min, max);
    while (cells.some(cell => cell.manhattanDistance(newCell) === 0)) {
      newCell = generateRandomLocatedCell(min, max);
    }
    cells.push(newCell);
  }
  return cells;
}

export function generateRandomLocatedCell(min, max) {
  return createCell(randomRange(min, max), randomRange(min, max));
}

function randomRange(min, max) {
  return Math.floor(Math.random() * max) + min;
}
