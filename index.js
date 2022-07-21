const state = {
    curr: 'START',
    result: 0
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
    '.': '#dot',
    C: '#clear',
    Enter: '#eq',
    Escape: '#clear',
    c: '#clear'
}

const display = document.querySelector('#display')
function updateDisplay() {
    switch (state.curr)
    {
        case 'LNUM':
            display.innerText = state.lnum
            break
        case 'RNUM':
            display.innerText = state.rnum
            break
        default:
            display.innerText = state.result
            break
    }
}

function setState(newState, value)
{
    state.curr = newState;
    switch (newState)
    {
        case 'START':
            state.result = 0
            updateDisplay()
            break
        case 'LNUM':
            state.lnum = value
            break
        case 'RNUM':
            state.rnum = value
            break
        case 'OP1':
        case 'OP2':
            state.op = value
            break
        case 'EQ1':
            state.result = state.lnum
            break
        case 'EQ2':
            calc()
            break
    }
}

function onNum(num)
{
    switch (state.curr)
    {
        case 'START':
            setState('LNUM', num)
            break
        case 'LNUM':
            if (num != '.' || state.lnum.indexOf(num) == -1) {
                state.lnum = (state.lnum + num).replace(/^0*(?!\.|$)/, '')
            }
            break
        case 'RNUM':
            if (num != '.' || state.rnum.indexOf(num) == -1) {
                state.rnum = (state.rnum + num).replace(/^0*(?!\.|$)/, '')
            }
            break
        case 'OP1':
            setState('RNUM', num)
            break
        case 'OP2':
            state.lnum = state.result
            setState('RNUM', num)
            break
        case 'EQ1':
            setState('LNUM', num)
            break
        case 'EQ2':
            setState('LNUM', num)
            break
    }
    updateDisplay()
}

function onOp(op)
{
    switch (state.curr)
    {
        case 'START':
            // do nothing
            break
        case 'LNUM':
            setState('OP1', op)
            break
        case 'RNUM':
            calc()
            setState('OP2', op)
            break
        case 'OP1':
            setState('OP1', op)
            break
        case 'OP2':
            setState('OP2', op)
            break
        case 'EQ1':
            setState('OP1', op)
            break
        case 'EQ2':
            setState('OP2', op)
            break
    }
    updateDisplay()
}

function onEq()
{
    switch (state.curr)
    {
        case 'START':
            state.lnum = '0'
            setState('EQ1')
            break
        case 'LNUM':
            setState('EQ1')
            break
        case 'RNUM':
            setState('EQ2')
            break
        case 'OP1':
            state.rnum = state.lnum
            setState('EQ2')
            break
        case 'OP2':
            state.lnum = state.result
            setState('EQ2')
            break
        case 'EQ1':
            // no change
            break
        case 'EQ2':
            state.lnum = state.result
            setState('EQ2')
            break
    }
    updateDisplay()
}

function calc1()
{
    const num = parseFloat(state.lnum)
    state.result = '' + operators[state.op](num, num)
}

function calc()
{
    state.result = '' + operators[state.op](parseFloat(state.lnum), parseFloat(state.rnum))
}

document.querySelector('#clear').addEventListener('click', e => setState('START'))
for (let op of ['add', 'sub', 'mul', 'div']) {
    document.querySelector(`#${op}`).addEventListener('click', e => onOp(op))
}
document.querySelector('#eq').addEventListener('click', onEq)
document.querySelector('#dot').addEventListener('click', e => onNum('.'))
for (let i = 0; i < 10; i++) {
    const c = i + ''
    document.querySelector(`#num${c}`).addEventListener('click', e => onNum(c))
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
    } else if (e.key * 1 == e.key) {
        target = `#num${e.key}`
    }
    if (target = document.querySelector(target)) {
        target.click()
    }
})