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
var ilegals = {};

function preparePage() {
    let cNum = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var cell = document.querySelector(`#cell-${cNum}`);
            cell.addEventListener("input", function () {
                InputChanged(this)
            });
            table[i][j] = cell.value
            cNum++;
        }
    }
}

function solveBegin() {
    flipButtonState("btn-clear")
    flipButtonState("btn-solve")
    flipButtonState("btn-generate")
    let cNum = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var cell = document.querySelector(`#cell-${cNum}`);
            cNum++;
            if (cell.value == null || cell.value == "") {
                table[i][j] = 0;
            }
            else {
                table[i][j] = cell.value;
            }
        }
    }
    showGrid();
    solved = false;
    isUnsolvable();
    solve();
    if(solved)
        animateGrid();
}

function isUnsolvable(){
    setTimeout(function(){
        if(solved == false){
            flipButtonState("btn-clear")
            flipButtonState("btn-solve")
            flipButtonState("btn-generate")
            alert("Sem Solução")
        }
    },500)
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
                    if (VerifyPos(i, j, y)) {
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
        solved = true;
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

function VerifyPos(line, row, value){
    return (VerifyLine(line, row, value) && VerifyRow(line, row, value) && VerifyBox(line, row, value))
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
                    await sleep(50)
                }
                cell.classList.toggle("active");
            }
            cNum++;
        }
    }
    flipButtonState("btn-clear")
    flipButtonState("btn-solve")
    flipButtonState("btn-generate")
}

/* function cleanGrid() {
    var cPos = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            var cell = document.querySelector(`#cell-${cPos}`);
            if (Number.isInteger(table[i][j])) {
                cell.value = null;
            }
            cPos++;
        }
    }
} */

function clearGrid() {
    var cPos = 0;
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            table[i][j] = 0;
            document.querySelector(`#cell-${cPos}`).classList.remove("ilegalElement")
            cPos++;
        }
    }
    document.querySelector("#btn-solve").disabled = false
    showGrid();
}

function flipButtonState(id) {
    document.querySelector(`#${id}`).disabled = (!(document.querySelector(`#${id}`).disabled));
    document.querySelector(`#${id}`).classList.toggle("disabled");
}

function InputChanged(element) {
    isLegalInput(element)
    VerifyIlegals();
    btnSolve = document.querySelector("#btn-solve")
    if (Object.keys(ilegals).length) {
        btnSolve.disabled = true
        btnSolve.classList.add("disabled")
    }
    else {
        btnSolve.disabled = false
        btnSolve.classList.remove("disabled")
    }
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
        isLegal = true
        element.classList.remove("ilegalElement")
        delete ilegals[element.id]
    }
    else {
        if (VerifyPos(line, row, element.value) || element.value == '') {
            isLegal = true
            element.classList.remove("ilegalElement")
            delete ilegals[element.id]
        }
        else {
            isLegal = false
            ilegals[element.id] = element
        }
    }
    table[line][row] = element.value
    return isLegal;
}

function VerifyIlegals() {
    if (Object.keys(ilegals).length) {
        for (var key in ilegals) {
            isLegalInput(ilegals[key])
        }
    }
}

function generate() {
    solved = false
    clearGrid()
    var line, row, value, gridHints = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]]
    var numTips = (Math.round(Math.random() * 18) + 15)
    do {
        line = Math.round(Math.random() * 8)
        row = Math.round(Math.random() * 8)
        value = (Math.round(Math.random() * 8) + 1)

        if (VerifyPos(line, row, value)) {
            gridHints[line][row] = value
            table[line][row] = value
            numTips--
        }
    } while (numTips)
    solve()
    console.log(gridHints)
    if(solved){
        table = gridHints
        showGrid()
    }
    else
        generate()
}
