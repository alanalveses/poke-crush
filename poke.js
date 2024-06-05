var pokemons = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
var board = [];
var rows = 9;
var columns = 9;
var score = 0;

var currTile;
var otherTile;

var timeLeft = 120; 

document.addEventListener("DOMContentLoaded", () => {
    const backgrounds = [
        "./images/background.jpg",
        "./images/background1.jpg",
        "./images/background2.jpg",
        "./images/background3.jpg",
        "./images/background4.jpg",
    ];

    const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];

    document.body.style.background = `url('${randomBackground}') no-repeat center center fixed`;
    document.body.style.backgroundSize = "cover";
});

window.onload = function() {
    startGame();

    //1/10th of a second
    window.setInterval(function(){
        crushPoke();
        slidePoke();
        generatePoke();
    }, 100);

    // Update timer every second
    setInterval(updateTimer, 1000);
}

function randomPoke() {
    return pokemons[Math.floor(Math.random() * pokemons.length)]; //0 - 5.99
}

function startGame() {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomPoke() + ".png";

            // DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart); //click on a Poke, initialize drag process
            tile.addEventListener("dragover", dragOver);  //clicking on Poke, moving mouse to drag the Poke
            tile.addEventListener("dragenter", dragEnter); //dragging Poke onto another Poke
            tile.addEventListener("dragleave", dragLeave); //leave Poke over another Poke
            tile.addEventListener("drop", dragDrop); //dropping a Poke over another Poke
            tile.addEventListener("dragend", dragEnd); //after drag process completed, we swap pokemons

            // TOUCH FUNCTIONALITY
            tile.addEventListener("touchstart", touchStart);
            tile.addEventListener("touchmove", touchMove);
            tile.addEventListener("touchend", touchEnd);

            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function dragStart() {
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
    otherTile = this;
}

function dragEnd() {
    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return;
    }

    let currCoords = currTile.id.split("-");
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = c2 == c - 1 && r == r2;
    let moveRight = c2 == c + 1 && r == r2;

    let moveUp = r2 == r - 1 && c == c2;
    let moveDown = r2 == r + 1 && c == c2;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;

        let validMove = checkValid();
        if (!validMove) {
            let currImg = currTile.src;
            let otherImg = otherTile.src;
            currTile.src = otherImg;
            otherTile.src = currImg;    
        } else {
            // Atualize o tabuleiro após uma troca válida
            crushPoke();
            slidePoke();
            generatePoke();
        }
    }
}

function touchStart(e) {
    e.preventDefault();
    currTile = e.target;
}

function touchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    otherTile = document.elementFromPoint(touch.clientX, touch.clientY);
}

function touchEnd(e) {
    e.preventDefault();
    dragEnd();
}

function crushPoke() {
    crushFour(); 
    crushThree();
    document.getElementById("score").innerText = score;
}

function crushThree() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let poke1 = board[r][c];
            let poke2 = board[r][c+1];
            let poke3 = board[r][c+2];
            if (poke1.src == poke2.src && poke2.src == poke3.src && !poke1.src.includes("blank")) {
                poke1.src = "./images/blank.png";
                poke2.src = "./images/blank.png";
                poke3.src = "./images/blank.png";
                score += 30;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let poke1 = board[r][c];
            let poke2 = board[r+1][c];
            let poke3 = board[r+2][c];
            if (poke1.src == poke2.src && poke2.src == poke3.src && !poke1.src.includes("blank")) {
                poke1.src = "./images/blank.png";
                poke2.src = "./images/blank.png";
                poke3.src = "./images/blank.png";
                score += 30;
            }
        }
    }
}

function checkValid() {
    //check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let poke1 = board[r][c];
            let poke2 = board[r][c+1];
            let poke3 = board[r][c+2];
            if (poke1.src == poke2.src && poke2.src == poke3.src && !poke1.src.includes("blank")) {
                return true;
            }
        }
    }

    //check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let poke1 = board[r][c];
            let poke2 = board[r+1][c];
            let poke3 = board[r+2][c];
            if (poke1.src == poke2.src && poke2.src == poke3.src && !poke1.src.includes("blank")) {
                return true;
            }
        }
    }

    return false;
}

function slidePoke() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = columns - 1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }

        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
        }
    }
}

function crushFour() {
    // Verifica linhas
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-3; c++) {
            let poke1 = board[r][c];
            let poke2 = board[r][c+1];
            let poke3 = board[r][c+2];
            let poke4 = board[r][c+3];
            if (poke1.src == poke2.src && poke2.src == poke3.src && poke3.src == poke4.src && !poke1.src.includes("blank")) {
                poke1.src = "./images/blank.png";
                poke2.src = "./images/blank.png";
                poke3.src = "./images/blank.png";
                // Transforma o quarto Pokémon em um Pokémon especial
                poke4.src = "./images/Pink.png";
                score += 40;
            }
        }
    }

    // Verifica colunas
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-3; r++) {
            let poke1 = board[r][c];
            let poke2 = board[r+1][c];
            let poke3 = board[r+2][c];
            let poke4 = board[r+3][c];
            if (poke1.src == poke2.src && poke2.src == poke3.src && poke3.src == poke4.src && !poke1.src.includes("blank")) {
                poke1.src = "./images/blank.png";
                poke2.src = "./images/blank.png";
                poke3.src = "./images/blank.png";
                // Transforma o quarto Pokémon em um Pokémon especial
                poke4.src = "./images/Pink.png";
                score += 40;
            }
        }
    }
}

function generatePoke() {
    for (let c = 0; c < columns;  c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./images/" + randomPoke() + ".png";
            let specialPoke = board[0][c];
            if (specialPoke.src.includes("Pink.png")) {
                setTimeout(() => explodePoke(specialPoke.id), 1000);
            }
        }
    }
}

function explodePoke(id) {
    let [r, c] = id.split("-").map(Number);
    for (let i = r - 1; i <= r + 1; i++) {
        for (let j = c - 1; j <= c + 1; j++) {
            if (i >= 0 && i < rows && j >= 0 && j < columns) {
                let poke = board[i][j];
                if (!poke.src.includes("blank")) {
                    poke.src = "./images/blank.png";
                }
            }
        }
    }
    score += 50;
    document.getElementById("score").innerText = score;
}

function updateTimer() {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;
    if (timeLeft === 0) {
        clearInterval(timerInterval);
        alert("Tempo esgotado! Fim do jogo.");
    }
}

var timerInterval = setInterval(updateTimer, 1000);
