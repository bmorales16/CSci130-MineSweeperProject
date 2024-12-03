let board = [];
let rows = 8;
let columns = 8;

let minesCount = 5;
let minesLocation = [];

let tilesClicked = 0;
let flagEnabled = false;
let flagCount = 0;

let gameOver = false;
let timer = 0;
let interval;

window.onload = function() {
    setupEventListeners();
    startGame();
};

function setupEventListeners() {
    document.getElementById("flag-button").addEventListener("click", setFlag);
    document.getElementById("restart-button").addEventListener("click", restartGame);
    document.getElementById("difficulty").addEventListener("change", restartGame);
    document.getElementById("theme").addEventListener("change", changeTheme);
}

function setMines() {
    minesLocation = [];
    while (minesLocation.length < minesCount) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = `${r}-${c}`;
        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
        }
    }
}

function startGame() {
    clearInterval(interval);
    timer = 0;
    document.getElementById("timer").innerText = timer;
    interval = setInterval(() => {
        if (!gameOver) {
            timer++;
            document.getElementById("timer").innerText = timer;
        }
    }, 1000);

    minesCount = parseInt(document.getElementById("mine-count").value) || 5;
    let difficulty = document.getElementById("difficulty").value;

    if (difficulty === "easy") {
        rows = 8; columns = 8;
    } else if (difficulty === "medium") {
        rows = 16; columns = 16;
    } else if (difficulty === "hard") {
        rows = 24; columns = 24;
    }

    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("board").innerHTML = "";
    board = [];
    tilesClicked = 0;
    flagCount = 0;
    gameOver = false;

    setMines();

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

function restartGame() {
    startGame();
}

function setFlag() {
    flagEnabled = !flagEnabled;
    document.getElementById("flag-button").style.backgroundColor = flagEnabled ? "darkgray" : "lightgray";
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) return;

    let tile = this;

    if (flagEnabled) {
        if (tile.innerText === "") {
            tile.innerText = "🚩";
            flagCount++;
        } else if (tile.innerText === "🚩") {
            tile.innerText = "";
            flagCount--;
        }
        return;
    }

    if (minesLocation.includes(tile.id)) {
        document.getElementById("mine-sound").play();
        alert("Game Over");
        revealMines();
        gameOver = true;
        clearInterval(interval);
        return;
    }

    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    if (tilesClicked === 0 && minesLocation.includes(tile.id)) {
        setMines(); // Ensure the first click is safe
        clickTile.call(tile);
        return;
    }

    checkMine(r, c);

    let winCondition = document.getElementById("win-condition").value;
    if (
        (winCondition === "clear-grid" && tilesClicked === rows * columns - minesCount) ||
        (winCondition === "select-mines" && flagCount === minesCount && allFlagsCorrect())
    ) {
        document.getElementById("win-sound").play();
        alert("You win!");
        gameOver = true;
        clearInterval(interval);
    }
}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) return;
    if (board[r][c].classList.contains("tile-clicked")) return;

    board[r][c].classList.add("tile-clicked");
    board[r][c].style.backgroundColor = "darkgrey";
    tilesClicked++;

    let minesFound = 0;
    minesFound += checkTile(r - 1, c - 1);
    minesFound += checkTile(r - 1, c);
    minesFound += checkTile(r - 1, c + 1);
    minesFound += checkTile(r, c - 1);
    minesFound += checkTile(r, c + 1);
    minesFound += checkTile(r + 1, c - 1);
    minesFound += checkTile(r + 1, c);
    minesFound += checkTile(r + 1, c + 1);

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    } else {
        checkMine(r - 1, c - 1);
        checkMine(r - 1, c);
        checkMine(r - 1, c + 1);
        checkMine(r, c - 1);
        checkMine(r, c + 1);
        checkMine(r + 1, c - 1);
        checkMine(r + 1, c);
        checkMine(r + 1, c + 1);
    }
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) return 0;
    return minesLocation.includes(`${r}-${c}`) ? 1 : 0;
}

function allFlagsCorrect() {
    return minesLocation.every((mine) => {
        let tile = document.getElementById(mine);
        return tile.innerText === "🚩";
    });
}

function changeTheme() {
    document.body.className = document.getElementById("theme").value;
}
