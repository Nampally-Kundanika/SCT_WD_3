// Game variables
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;

let scores = {
    X: 0,
    O: 0,
    draw: 0
};

// Winning patterns
const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Symbols and player names
const symbols = {
    X: "🚀",
    O: "🪐"
};

const players = {
    X: "🚀 Rocket",
    O: "🪐 Planet"
};

// Get HTML elements
const cells = document.querySelectorAll(".cell");
const boardElement = document.getElementById("board");
const turnDisplay = document.getElementById("turnDisplay");
const statusMessage = document.getElementById("statusMessage");

const resetBtn = document.getElementById("resetBtn");
const newMatchBtn = document.getElementById("newMatchBtn");
const gameMode = document.getElementById("gameMode");

const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const scoreDraw = document.getElementById("scoreDraw");

// Cell click
cells.forEach(cell => {
    cell.addEventListener("click", function () {
        let index = cell.dataset.index;
        handleMove(index);
    });
});

// Buttons
resetBtn.addEventListener("click", resetBoard);
newMatchBtn.addEventListener("click", startNewMatch);
gameMode.addEventListener("change", startNewMatch);

// Handle player move
function handleMove(index) {

    if (gameOver || board[index] !== "") {
        return;
    }

    placeSymbol(index, currentPlayer);

    let result = checkWinner();

    if (result) {
        finishGame(result);
        return;
    }

    if (currentPlayer === "X") {
        currentPlayer = "O";
    } else {
        currentPlayer = "X";
    }

    updateTurn();

    if (gameMode.value === "pvc" && currentPlayer === "O") {

        boardElement.style.pointerEvents = "none";

        setTimeout(function () {

            computerMove();

            boardElement.style.pointerEvents = "auto";

        }, 500);

    }
}

// Put symbol on board
function placeSymbol(index, player) {

    board[index] = player;

    cells[index].textContent = symbols[player];
    cells[index].classList.add("taken", "pop");

}

// Computer move
function computerMove() {

    if (gameOver) {
        return;
    }

    let move = findBestMove();

    placeSymbol(move, "O");

    let result = checkWinner();

    if (result) {
        finishGame(result);
        return;
    }

    currentPlayer = "X";
    updateTurn();
}

// Find computer move
function findBestMove() {

    let emptyCells = [];

    for (let i = 0; i < board.length; i++) {

        if (board[i] === "") {
            emptyCells.push(i);
        }

    }

    let randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
}

// Check winner
function checkWinner() {

    for (let i = 0; i < winningPatterns.length; i++) {

        let a = winningPatterns[i][0];
        let b = winningPatterns[i][1];
        let c = winningPatterns[i][2];

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {

            return {
                winner: board[a],
                combo: [a, b, c]
            };

        }

    }

    let filled = true;

    for (let i = 0; i < board.length; i++) {

        if (board[i] === "") {
            filled = false;
            break;
        }

    }

    if (filled) {
        return {
            winner: null
        };
    }

    return null;
}

// Finish game
function finishGame(result) {

    gameOver = true;

    turnDisplay.textContent = "";

    if (result.winner === "X") {

        scores.X++;
        updateScores();
        highlightWinner(result.combo);

        showMessage("🏆 Rocket Wins!", false);

    }

    else if (result.winner === "O") {

        scores.O++;
        updateScores();
        highlightWinner(result.combo);

        showMessage("🏆 Planet Wins!", false);

    }

    else {

        scores.draw++;
        updateScores();

        showMessage("🤝 It's a Draw!", true);

    }

}

// Highlight winner
function highlightWinner(combo) {

    for (let i = 0; i < combo.length; i++) {

        cells[combo[i]].classList.add("winner");

    }

}

// Show result
function showMessage(message, isDraw) {

    statusMessage.textContent = message;

    statusMessage.classList.remove("hidden");

    if (isDraw) {
        statusMessage.classList.add("draw");
    } else {
        statusMessage.classList.remove("draw");
    }

}

// Update turn
function updateTurn() {

    if (gameOver) {
        return;
    }

    turnDisplay.textContent = players[currentPlayer] + "'s Turn";

}

// Update scoreboard
function updateScores() {

    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
    scoreDraw.textContent = scores.draw;

}

// Reset current game
function resetBoard() {

    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameOver = false;

    cells.forEach(function (cell) {

        cell.textContent = "";
        cell.classList.remove("taken", "winner", "pop");

    });

    statusMessage.classList.add("hidden");

    updateTurn();

}

// Start a new match
function startNewMatch() {

    scores = {
        X: 0,
        O: 0,
        draw: 0
    };

    updateScores();
    resetBoard();

}

// Start the game
updateScores();
updateTurn();