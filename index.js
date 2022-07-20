const state = {
    result: undefined,
    currOp: 'add',
    currNum: ''
}

const operators = {
    add: (l, r) => l + r,
    sub: (l, r) => l - r,
    mul: (l, r) => l * r,
    div: (l, r) => l / r
}

const display = document.querySelector('#display')

function updateDisplay() {
    if (typeof(state.currNum) !== 'string' || state.currNum === '') {
        display.innerText = state.result
    } else {
        display.innerText = state.currNum
    }
}

function updateResult() {
    if (state.currNum === '') {
        state.currNum = state.result
    } else {
        state.currNum = parseFloat(state.currNum)
    }
    state.result = operators[state.currOp](state.result, state.currNum)
}

function setOperator(op) {
    if (state.result === undefined)  {
        state.result = parseFloat(state.currNum)
        state.currOp = op
    } else if (state.currNum === '') {
        updateResult()
        state.currOp = op
    } else {
        state.currOp = op
        updateResult()
    }
    state.currNum = ''
    updateDisplay()
}

document.querySelector('#clear').addEventListener('click', e => {
    state.currNum = ''
    state.result = 0
    updateDisplay()
    state.result = undefined
    state.lastAction = {
        operator: 'add',
        value: 0
    }
})

for (let op of ['add', 'sub', 'mul', 'div']) {
    document.querySelector(`#${op}`).addEventListener('click', e => setOperator(op))
}

document.querySelector('#eq').addEventListener('click', e => {
    updateResult()
    updateDisplay()
})

document.querySelector('#dot').addEventListener('click', e => {
    if (state.currNum.indexOf('.') == -1) {
        state.currNum += '.'
        updateDisplay()
    }
})

for (let i = 0; i < 10; i++) {
    document.querySelector(`#num${i}`).addEventListener('click', e => {
        if (typeof(state.currNum) === 'number') {
            state.currNum = ''
            state.result = undefined
        }
        state.currNum += i
        updateDisplay()
    })
}