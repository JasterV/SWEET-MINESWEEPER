import { createCell, generateNRandomCells } from "./cell.js";

export function createBoard(size, numMines) {
  let board = [];
  const mines = generateNRandomCells(numMines, 0, size);
  
  for (let row = 0; row < size; row++) {
    board.push([]);
    for (let col = 0; col < size; col++) {
      let newCell = createCell(row, col);
      let neighbourMines = countNeighbourMines(mines, newCell);
      newCell.type = neighbourMines;
      board[row].push(newCell);
    }
  }
  
  mines.forEach(mine => (board[mine.row][mine.col].type = "mine"));
  return board;
}

export function showAllBoardMines(board) {
  board.forEach(row =>
    row.forEach(cell => {
      if (isMine(cell)) {
        cell.discover();
      }
    })
  );
}

export function discoverNeighbours(board, cell) {
  let queue = [];
  let visiteds = [];
  queue.push(cell);

  while (queue.length > 0) {
    let currentCell = queue.shift();
    if (!containsCell(visiteds, currentCell) && currentCell.type == 0) {
      visiteds.push(currentCell);
      let validNeighbours = getValidNeighbours(board, currentCell);

      for (let neighbour of validNeighbours) {
        neighbour.discover();
        queue.push(neighbour);
      }
    }
  }
}

export function isMine(cell) {
  return cell.type === "mine";
}

export function countDiscoveredCells(board) {
  return board.reduce((result, row) => result + row.reduce((total, cell) => cell.isHidden() ? total : total + 1, 0), 0);
}

function containsCell(arr, cell) {
  return arr.some(other => other.row === cell.row && other.col === cell.col);
}

function validCoords(board, row, col) {
  return row >= 0 && row < board.length && col >= 0 && col < board.length;
}

function getValidNeighbours(board, cell) {
  let result = [];
  for (let i = cell.row - 1; i <= cell.row + 1; i++) {
    for (let j = cell.col - 1; j <= cell.col + 1; j++) {
      if (validCoords(board, i, j)) {
        let neighbour = board[i][j];
        if (neighbour.isHidden() && cell.manhattanDistance(neighbour) > 0) {
          result.push(neighbour);
        }
      }
    }
  }
  return result;
}

function countNeighbourMines(mines, cell) {
  return mines.reduce((total, current) => {
    if (current.perpendicularTo(cell)) {
      return current.manhattanDistance(cell) === 1 ? total + 1 : total;
    } else {
      return current.manhattanDistance(cell) === 2 ? total + 1 : total;
    }
  }, 0);
}
