const timer = document.querySelector('#display-timer');
const displayInfo = document.querySelector('#display-info');
const startButton = document.querySelector('#start-button');
const playersForm = document.querySelector('#player-form');
const playerButton = document.querySelector('#player-submit');
const player1Label = document.querySelector('#player1-label');
const player2Label = document.querySelector('#player2-label');
const player1Score = document.querySelector('#player1-score');
const player2Score = document.querySelector('#player2-score');
const spaces = document.querySelectorAll('.circle');
const scoreLabels = document.querySelectorAll('.score-label');
const playerInputs  = document.querySelectorAll('.player-input');

const gameState = {
    idle: 0,
    playing: 1
}

class Player {
    name;
    score;

    constructor(name, score=0) {
        this.name = name;
        this.score = score;
    }

    getScore() {
        return `${this.name} has ${this.score} points`;
    }
}

let playerList = [];
let roundCount = 0;
let playerTurn = 0;
let isCalculating;

let gridArray = [[0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0]]

let currentState;

function checkPlayers() {
    if (playerList.length == 2) return true;
    return false; 
}

function checkValidPlay(r, c) {
    for (let i = gridArray.length - 1; i >= 0; i--) {
        if (gridArray[i][c] == 0) return { "row" : i, "col" : c};
    }
    
    return null;
}

function checkFull() {
    for (let i = 0; i < gridArray.length; i++) {
        for (let j = 0; j < gridArray[i].length; j++) {
            if (gridArray[i][j] == 0) return false;
        }
    }
    
    return true;
}

function checkWin() {
    for (let i = gridArray.length - 1; i >= 0; i--) {
        for (let j = 0; j < gridArray[i].length; j++) {
            if (gridArray[i][j] != 0) {
                // Horizontal
                if (j < gridArray[i].length - 4) {
                    if (gridArray[i][j] == 1 &&
                        gridArray[i][j+1] == 1 &&
                        gridArray[i][j+2] == 1 &&
                        gridArray[i][j+3] == 1) {
                        roundEnd(0)
                    }
                    if (gridArray[i][j] == 2 &&
                        gridArray[i][j+1] == 2 &&
                        gridArray[i][j+2] == 2 &&
                        gridArray[i][j+3] == 2) {
                        roundEnd(1)
                    }
                }

                // Vertical
                if (i > gridArray.length - 4) {
                    if (gridArray[i][j] == 1 &&
                        gridArray[i-1][j] == 1 &&
                        gridArray[i-2][j] == 1 &&
                        gridArray[i-3][j] == 1) {
                        roundEnd(0)
                    }
                    if (gridArray[i][j] == 2 &&
                        gridArray[i-1][j] == 2 &&
                        gridArray[i-2][j] == 2 &&
                        gridArray[i-3][j] == 2) {
                        roundEnd(1)
                    }
                }

                // Diagonal - Left to Right
                if (i > gridArray.length - 4 && j <= gridArray[i].length - 4) {
                    if (gridArray[i][j] == 1 &&
                        gridArray[i-1][j+1] == 1 &&
                        gridArray[i-2][j+2] == 1 &&
                        gridArray[i-3][j+3] == 1) {
                        roundEnd(0)
                    }
                    if (gridArray[i][j] == 2 &&
                        gridArray[i-1][j+1] == 2 &&
                        gridArray[i-2][j+2] == 2 &&
                        gridArray[i-3][j+3] == 2) {
                        roundEnd(1)
                    }
                }

                // Diagonal - Right to Left
                if (i <= gridArray.length - 4 && j <= gridArray[i].length - 4) {
                    if (gridArray[i][j] == 1 &&
                        gridArray[i+1][j+1] == 1 &&
                        gridArray[i+2][j+2] == 1 &&
                        gridArray[i+3][j+3] == 1) {
                        roundEnd(0)
                    }
                    if (gridArray[i][j] == 2 &&
                        gridArray[i+1][j+1] == 2 &&
                        gridArray[i+2][j+2] == 2 &&
                        gridArray[i+3][j+3] == 2) {
                        roundEnd(1)
                    }
                }

                // console.log(gridArray.length - 4);
                // console.log(gridArray[i].length - 4);
            }
        }
    }
}

function switchTurns() {
    if (playerTurn == 0) {
        playerTurn = 1;
        displayInfo.textContent = `${playerList[1].name}'s Turn`;
        displayInfo.classList.remove('p1-text');
        displayInfo.classList.add('p2-text');
    }
    else {
        playerTurn = 0;
        displayInfo.textContent = `${playerList[0].name}'s Turn`;
        displayInfo.classList.remove('p2-text');
        displayInfo.classList.add('p1-text');
    }
}

function clearGrid() {
    for (let i = 0; i < spaces.length; i++) {
        spaces[i].classList.remove('p1-circle');
        spaces[i].classList.remove('p2-circle');
    }

    gridArray = [[0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0]]
}

function addPlayers (e) {
    e.preventDefault();
    const regex = /[a-zA-Z]+([ ][a-z A-Z]+)*/;
    
    let player1Input = e.target.player1.value;
    let player2Input = e.target.player2.value;

    console.log('Adding Players');
    // console.log(regex.test(player1Input));
    // console.log(regex.test(player2Input));
    if (regex.test(player1Input) && regex.test(player2Input)) {
        playerList = [];

        let player1 = new Player(player1Input);
        let player2 = new Player(player2Input);

        playerList.push(player1);
        playerList.push(player2);
        
        playerButton.classList.add('hide');

        scoreLabels.forEach(el => {
            el.classList.remove('hide');
        });

        playerInputs.forEach(el => {
            el.classList.add('hide');
        });

        player1Label.classList.add('p1-text');
        player2Label.classList.add('p2-text');

        player1Label.textContent = player1Input;
        player2Label.textContent = player2Input;
        displayInfo.textContent = "Press the Start Button to Begin";


    }
    else {
        alert("Player Names invalid: Accepts letters only and spaces");
    }
    
}

function roundEnd(player) {
    currentState = gameState.idle;

    switch (player) {
        case 0:
            playerList[0].score++;
            player1Score.textContent = playerList[0].score;
            displayInfo.textContent = `${playerList[0].name} Wins!`;
            displayInfo.classList.remove('p2-text');
            displayInfo.classList.add('p1-text');
        break;
        case 1:
            playerList[1].score++;
            player2Score.textContent = playerList[1].score;
            displayInfo.textContent = `${playerList[1].name} Wins!`;
            displayInfo.classList.remove('p1-text');
            displayInfo.classList.add('p2-text');
        break;
        case 2:
            displayInfo.textContent = "No Winners!";
            displayInfo.classList.remove('p1-text');
            displayInfo.classList.remove('p2-text');
        break;
    }

    startButton.classList.remove('hide');
    startButton.textContent = "Restart";
}


function startGame () {
    currentState = gameState.playing;

    
}

function roundHandler() {
    switch(currentState) {
        case gameState.idle:
            if (checkPlayers()) {
                currentState = gameState.playing;
                
                clearGrid();

                let pTurnInit = Math.floor(Math.random() * 2);
                switch(pTurnInit) {
                    case 0:
                        playerTurn = 0;
                        displayInfo.textContent = `${playerList[0].name}'s Turn`;
                        displayInfo.classList.add('p1-text');
                    break;
                    case 1:
                        playerTurn = 1;
                        displayInfo.textContent = `${playerList[1].name}'s Turn`;
                        displayInfo.classList.add('p2-text');
                    break;
                }

                startButton.classList.add('hide');
    
                scoreLabels.forEach(el => {
                    el.classList.remove('hide');
                });
    
                playerInputs.forEach(el => {
                    el.classList.add('hide');
                });
            }
            else {
                alert('Please Enter Players');
            }
        break;
        case gameState.playing:

        break;
    }
        
    
    
}

function addPiece(e) {
    e.preventDefault();

    if (!isCalculating) {
        switch(currentState) {
            case gameState.playing:
                isCalculating = true;
                let pieceID = e.target.id;
                let splitString = pieceID.split("-");
                // console.log(splitString[1]);
                // console.log(splitString[2]);
    
                let foundIndex = checkValidPlay(splitString[1]-1, splitString[2]-1);
                if (foundIndex != null) {
                    gridArray[foundIndex['row']][foundIndex['col']] = playerTurn + 1;
                    let pieceTarget = document.querySelector(`#item-${foundIndex['row']+1}-${foundIndex['col']+1}`);
                    
                    switch (playerTurn) {
                        case 0:
                            pieceTarget.classList.add('p1-circle');
                        break;
                        case 1:
                            pieceTarget.classList.add('p2-circle');
                        break;
                    }
                    
                    switchTurns();
                }
    
                // console.log(gridArray);
    
                checkWin();
    
                if (currentState == gameState.playing) {
                    if (checkFull()) {
                        roundEnd(2);
                    }
                }
                
                isCalculating = false;
            break;
            case gameState.idle:
                alert('Please Start the Game');
            break;
        }
    }
    
}

function startGame(e) {
    e.preventDefault();
    isCalculating = false;

    roundHandler();
}

function initGame() {
    currentState = gameState.idle;
    for (let i = 0; i < spaces.length; i++) {
        spaces[i].addEventListener('click', addPiece);
    }

    startButton.addEventListener('click', startGame);
    playersForm.addEventListener('submit', addPlayers);

    gridArray = [[0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0]]
}

initGame();