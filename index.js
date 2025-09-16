const boardObj = (function () {
    let boardArr = [
        [" "," "," "],
        [" "," "," "],
        [" "," "," "]
    ];

    let markersPlaced = 0; // This is used to see if the entire board is full instead of going through the board array to check

    function getBoardArray() {
        // console.log(boardArr);
        return boardArr;
    }

    function resetBoardArray() {
        for (let row of boardArr) {
            for (let i = 0; i < 3; i++) {
                row[i] = " "; 
            }
        }
        markersPlaced = 0;
    }

    function placeMarker(marker, row, col) {
        let wasPlaced = true;

        if ((row < 0 || row > 2) || (col < 0 || col > 2)) { // Grouped for readability
            wasPlaced = false;
        } else if (boardArr[row][col] === " ") {
            boardArr[row][col] = marker;
            markersPlaced++;
        } else {
            wasPlaced = false;
        }

        return wasPlaced;
    }

    function checkForWinnerOrTie() {
        let winner = "n"; // n: none, t: tie, o: O player, x: X player
        let winCheck = false;

        // You only need to check the top row and left column since it takes all 3 spaces in a row/col/diagonal to win
        // Top row
        // 0,0
        let checkingMarker = boardArr[0][0];
        if (checkingMarker != " ") {
            winCheck = checkDown(checkingMarker, 0);
            if (winCheck) {
                winner = checkingMarker;
            }

            if (winner == "n") {
                winCheck = checkDiagonal(checkingMarker, 0);
                if (winCheck) {
                    winner = checkingMarker;
                }
            }
        
        }

        // 0,1
        if (winner == "n") {
            checkingMarker = boardArr[0][1];
            if (checkingMarker != " ") {
                winCheck = checkDown(checkingMarker, 1);
                if (winCheck) {
                    winner = checkingMarker;
                }
            }
        }

        // 0,2
        if (winner == "n") {
            let checkingMarker = boardArr[0][2];
            if (checkingMarker != " ") {
                winCheck = checkDown(checkingMarker, 2);
                if (winCheck) {
                    winner = checkingMarker;
                }

                if (winner == "n") {
                    winCheck = checkDiagonal(checkingMarker, 2);
                    if (winCheck) {
                        winner = checkingMarker;
                    }
                }
            }
        }

        // Left column
        if (winner == "n") {
            for (let i = 0; i < 3; i++) {
                checkingMarker = boardArr[i][0];
                if (checkingMarker != " ") {
                    winCheck = checkRight(checkingMarker, i);
                    if (winCheck) {
                        winner = checkingMarker;
                        break;
                    }
                }
            }
        }

        // Lastly, if all markers are placed but the above checks didn't find a winner, there must be a tie
        if (winner == "n" && markersPlaced == 9) {
            winner = "t";
        }

        return winner;
    }

    function checkDown(marker, col) {
        let allMatch = false;
        if (boardArr[1][col] == marker && boardArr[2][col] == marker) {
            allMatch = true;
        }
        return allMatch;
    }

    function checkRight(marker, row) {
        let allMatch = false;
        if (boardArr[row][1] == marker && boardArr[row][2] == marker) {
            allMatch = true;
        }
        return allMatch;
    }

    function checkDiagonal(marker, col) {
        let allMatch = false;
        /* 
        The logic for checking the diagonals is the same for the first and last column except they check in the reverse
        column order, so multiplying the column check by a value allows for less code. It is slower, but in this case
        I assume that isn't especially important.
        */
        let directionFlipper = 1;
        if (col == 2) {
            directionFlipper = -1;
        }

        if (boardArr[1][col+1*directionFlipper] == marker && boardArr[2][col+2*directionFlipper] == marker) {
            allMatch = true;
        }
        return allMatch;
    }

    return {getBoardArray, resetBoardArray, placeMarker, checkForWinnerOrTie}
})();

const domManipulationObj = (function() {
    const boardEle = document.querySelector("#board-container");
    let winnerChar = "n"; // "n" is the base case for boardObj

    boardEle.addEventListener("click", (e) => {
        const cell = e.target;
        const cellID = cell.id;
        let [row, col] = cellID.split("-"); // Each cell in the HTML has an id formatted as id="row-col"
        

        let wasPlaced = boardObj.placeMarker(playerHandler.getCurrentMarker(), row, col);
        if (wasPlaced) {
            // Place the marker
            cell.innerText = playerHandler.getCurrentMarker().toUpperCase();

            // Post placement handling
            playerHandler.swapMarker();
            winnerChar = boardObj.checkForWinnerOrTie();
            if (winnerChar != "n") { // If not n, there is a winner or tie
                updateForWinner(winnerChar);
            }
        }

    });

    const thisRoundWinnerContainer = document.querySelector(".this-round-winner-container");
    const thisRoundWinner = document.querySelector("#this-round-winner");
    function updateForWinner(winnerChar) {
        playerHandler.updateWinnerCount(winnerChar);
        let winnerWhole = "";
        if (winnerChar == 'x') {
            winnerWhole = "Player 1"
        } else if (winnerChar == 'o') {
            winnerWhole = "Player 2"
        } else {
            winnerWhole = "Tie";
        }
        thisRoundWinner.innerText = winnerWhole;
        thisRoundWinnerContainer.style.visibility = "visible";
    }
})();

const playerHandler = (function() {
    let currentMarker = "x"; // Swaps between x and o, x goes first so start with it
    let player1wins = 0;
    let player2wins = 0;
    let tieWins = 0;

    function swapMarker() {
        currentMarker = currentMarker === "x" ? "o" : "x";
    }

    function getCurrentMarker() {
        return currentMarker;
    }

    function updateWinnerCount(winnerChar) {
        if (winnerChar == "x") {
            player1wins++;
        } else if (winnerChar == "o") {
            player2wins++;
        } else {
            tieWins++;
        }
    }

    function getWinCount(char) { // Use char because it is equivalent to winnerChar used throughout the code
        let wins = 0;
        if (char == "x") {
            wins = player1wins;
        } else if (char == "o"){
            wins = player2wins;
        } else {
            wins = tieWins;
        }
        return wins;
    }

    return {swapMarker, getCurrentMarker, updateWinnerCount, getWinCount}
})();