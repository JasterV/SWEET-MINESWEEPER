import {
  createBoard,
  isMine,
  discoverNeighbours,
  showAllBoardMines,
  countDiscoveredCells
} from "./board.js";

const BOARD_SIZE = 10;
const BOARD_CELLS = BOARD_SIZE ** 2;
const NUM_MINES = 13;

const grid = document.getElementById("mines-grid");
let overlay = document.querySelector(".overlay");
let playAgainBtn = document.getElementById("play-again-btn");
// SOUNDS
let popSound = document.getElementById("pop-sound");
let congratsSound = document.getElementById("congrats-sound");
let failSound = document.getElementById("fail-sound");

/**----------------------------------------- */
/**------------ EVENT LISTENERS ------------ */
/**----------------------------------------- */

playAgainBtn.addEventListener("click", () => {
  startNewGame();
  hideOverlayPanel();
});

startNewGame();

// GAME FUNCTIONS

function startNewGame() {
  let board = createBoard(BOARD_SIZE, NUM_MINES);
  addGameRules(board);
  displayBoard(board, BOARD_SIZE);
}

function addGameRules(board) {
  board.forEach(row =>
    row.forEach(cell => {
      cell.asHtmlElement.addEventListener("click", () => {
        if (isMine(cell)) {
          failSound.play();
          showAllBoardMines(board);
          displayGameOverPanel();
        } else {
          if (cell.type == 0 && cell.isHidden()) {
            congratsSound.play();
            cell.discover();
            discoverNeighbours(board, cell);
          } else {
            popSound.play();
            cell.discover();
            if (countDiscoveredCells(board) === BOARD_CELLS - NUM_MINES) {
              displayGameWonPanel();
            }
          }
        }
      });
      // EVENT LISTENER FOR RIGHT CLICK
      cell.asHtmlElement.addEventListener("contextmenu", e => {
        e.preventDefault();
        if (cell.isHidden()) cell.toggleFlag();
      });
    })
  );
}

function displayBoard(board, size) {
  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  board.forEach(row => row.forEach(cell => grid.append(cell.asHtmlElement)));
}

function hideOverlayPanel() {
  overlay.classList.add("hide");
}

function displayGameWonPanel() {
  document.getElementById("panel-message").textContent = "You Win!! Congrats!!";
  overlay.classList.remove("hide");
}

function displayGameOverPanel() {
  document.getElementById("panel-message").textContent =
    "You loose, try again!";
  overlay.classList.remove("hide");
}
