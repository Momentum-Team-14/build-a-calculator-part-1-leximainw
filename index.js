const state = {
    result: undefined,
    currOp: undefined,
    currNum: ''
}

const operators = {
    add: (l, r) => l + r,
    sub: (l, r) => l - r,
    mul: (l, r) => l * r,
    div: (l, r) => l / r
}

const opKeyMap = {
    '+': '#add',
    '-': '#sub',
    '*': '#mul',
    '/': '#div',
    '=': '#eq',
    C: '#clear',
    Enter: '#eq',
    Escape: '#clear',
    c: '#clear'
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
    if (operators.hasOwnProperty(state.currOp)) {
        state.result = operators[state.currOp](state.result, state.currNum)
    } else {
        state.result = state.currNum
    }
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
    state.currOp = undefined
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
        state.currNum = state.currNum.replace(/^0+/, '') + i
        updateDisplay()
    })
}

document.addEventListener('keydown', e => {
    let target
    if (e.key === 'Backspace') {
        if (typeof(state.currNum) === 'number') {
            target = 'clear'
        } else if (state.currNum.length != 0) {
            if (state.currNum.length == 1) {
                state.currNum = '0'
            } else {
                state.currNum = state.currNum.substring(0, state.currNum.length - 1)
            }
            updateDisplay()
        }
    } else if (opKeyMap.hasOwnProperty(e.key)) {
        target = opKeyMap[e.key]
    } else {
        target = `#num${e.key}`
    }
    if (target = document.querySelector(target)) {
        target.click()
    }
})