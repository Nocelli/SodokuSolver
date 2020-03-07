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
var ilegals = [];

function preparePage() {
    let cNum = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var cell = document.querySelector(`#cell-${cNum}`);
            cell.addEventListener("input", function () {
                isLegalInput(this)
            });
            table[i][j] = cell.value
            cNum++;
        }
    }
}

function solveBegin() {
    flipButtonState("btn-clear")
    flipButtonState("btn-solve")
    let cNum = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var cell = document.querySelector(`#cell-${cNum}`);
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
            var cell = document.querySelector(`#cell-${cNum}`);
            if (table[i][j] == 0) {
                cell.value = null
                cell.disabled = false;
            }
            else {
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
        solved = true;
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

function disableGrid() {
    var inputs = document.querySelectorAll("input")
    inputs.forEach(element => {
        element.disabled = true
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function animateGrid() {
    disableGrid()
    var cNum = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var cell = document.querySelector(`#cell-${cNum}`);
            if (Number.isInteger(table[i][j])) {
                cell.classList.toggle("active");
                for (var y = 0; y < parseInt(table[i][j]) + 1; y++) {
                    cell.value = y;
                    await sleep(50);
                }
                cell.classList.toggle("active");
            }
            cNum++;
        }
    }

    alert("Tempo total: " + time + "ms");
    flipButtonState("btn-clear")
    flipButtonState("btn-solve")
}

function cleanGrid() {
    var cPos = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var cell = document.querySelector(`#cell-${cNum}`);
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

function flipButtonState(id) {
    document.querySelector(`#${id}`).disabled = (!(document.querySelector(`#${id}`).disabled));
    document.querySelector(`#${id}`).classList.toggle("disabled");
}

function isLegalInput(element) {
    element.classList.add("ilegalElement")
    var isLegal
    var line, row, posAux = 0
    var pos = element.id.split('-')[1];
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            if (posAux == pos && line == null) {
                line = i;
                row = j;
                break
            }
            posAux++;
        }
    }
    if (element.value > 10 || element.value <= 0 || !(Number.isInteger(parseInt(element.value)))) {
        element.value = null;
        element.classList.remove("ilegalElement")
    }
    else {
        if ((VerifyLine(line, row, element.value) &&
            VerifyRow(line, row, element.value) &&
            VerifyBox(line, row, element.value
            ) || element.value == '')) {
            isLegal = true
            element.classList.remove("ilegalElement")
        }
        else
            isLegal = false
    }
    table[line][row] = element.value
    return isLegal;
}