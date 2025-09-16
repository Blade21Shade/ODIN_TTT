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