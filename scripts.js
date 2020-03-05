var table = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]]

var solved = false;
var time;
function solveBegin() {
    let cNum = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var cell = document.getElementById("cell-" + cNum);
            cNum++;
            if (cell.value == null) {
                table[i][j] = 0;
            }
            else {
                table[i][j] = cell.value;
            }
        }
    }
    showGrid();
    solved = false;
    time = new Date;
    solve();
}

function showGrid() {
    let cNum = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var cell = document.getElementById("cell-" + cNum);
            if (table[i][j] == 0)
            {
                cell.value = null
                cell.disabled = false;
            }
            else
            {
                cell.value = table[i][j]
                cell.disabled = true;
            }
            cNum++;
        }
    }
}

function solve() {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (table[i][j] == 0) {
                for (var y = 1; y < 10; y++) {

                    if (VerifyLine(i, j, y) && VerifyRow(i, j, y) && VerifyBox(i, j, y)) {
                        table[i][j] = y;
                        solve();
                        if (!(solved))
                            table[i][j] = 0;
                    }
                }
                return;
            }
        }
    }
    if (!(solved)) {
        time = new Date - time;
        showGrid();
        solved = true;
        console.log(table);
        animateGrid();
    }
}

function VerifyLine(line, row, value) {
    for (var i = 0; i < 9; i++) {
        if (table[i][row] == value) {
            if (i != line) {
                return false;
            }
        }
    }
    return true;
}

function VerifyRow(line, row, value) {
    for (var i = 0; i < 9; i++) {
        if (table[line][i] == value) {
            if (i != row) {
                return false;
            }
        }
    }
    return true;
}

function VerifyBox(line, row, value) {
    var posY = parseInt(line / 3);
    var posX = parseInt(row / 3);

    for (var i = posY * 3; i < (posY * 3) + 3; i++) {
        for (var j = posX * 3; j < (posX * 3) + 3; j++) {
            if (table[i][j] == value) {
                if (!(i == line && j == row)) {
                    return false;
                }
            }
        }
    }
    return true;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function animateGrid() {
    cleanGrid();
    var cPos = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var cell = document.getElementById("cell-" + cPos);
            if (Number.isInteger(table[i][j])) {
                cell.classList.toggle("active");
                for (var y = 0; y < parseInt(table[i][j]) + 1; y++) {
                    cell.value = y;
                    await sleep(50);
                }
                cell.classList.toggle("active");
            }
            cPos++;
        }
    }
    
    alert("Tempo total: " + time + "ms");
}

function cleanGrid() {
    var cPos = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var cell = document.getElementById("cell-" + cPos);
            if (Number.isInteger(table[i][j])) {
                cell.value = null;
            }
            cPos++;
        }
    }
}

function clearGrid() {
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            table[i][j] = 0;
        }
    }
    showGrid();
}