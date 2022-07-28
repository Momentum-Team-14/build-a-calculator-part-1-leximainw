// current state of calculator FSM
const state = {
    curr: 'START',
    result: 0
}

// map of operator names to operators
const operators = {
    add: (l, r) => l + r,
    sub: (l, r) => l - r,
    mul: (l, r) => l * r,
    div: (l, r) => l / r
}

// map of keys to associated button elements
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

// display update code
const display = document.querySelector('#display')
function updateDisplay() {

    // select display value based on current FSM state
    let value
    switch (state.curr)
    {
        case 'LNUM':
            value = state.lnum
            break
        case 'RNUM':
            value = state.rnum
            break
        default:
            value = state.result
            break
    }

    // cast value to string and trim it to try to reduce text overflow
    value += ''
    let exp = value.toLowerCase().indexOf('e')
    let mant = exp == -1 ? value : value.substring(0, exp)
    exp = exp == -1 ? '' : value.substring(exp)
    mant = mant.substring(0, 15 - exp.length + (mant.startsWith('-') ? 1 : 0)).replace(/\.$/, '')
    display.innerText = mant + exp
}

// FSM state update - corresponds to 'ENTER' in calc-fsm.txt
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
            state.result = 0
            state.lnum = value == '.' ? '0.' : value
            break
        case 'RNUM':
            state.rnum = value == '.' ? '0.' : value
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

// number key action - corresponds to 'num' in calc-fsm.txt
function onNum(num)
{
    switch (state.curr)
    {
        case 'START':
        case 'EQ1':
        case 'EQ2':
            setState('LNUM', num)
            break
        case 'LNUM':
            state.lnum = advanceNum(state.lnum, num)
            break
        case 'RNUM':
            state.rnum = advanceNum(state.rnum, num)
            break
        case 'OP1':
            setState('RNUM', num)
            break
        case 'OP2':
            state.lnum = state.result
            setState('RNUM', num)
            break
    }
    updateDisplay()
    function advanceNum(value, num) {
        if (num != '.' || value.indexOf(num) == -1) {
            // regex to trim leading zeroes, except one before a decimal point
            value = (value + num).replace(/^0*(?!\.|$)/, '')
        }
        return value
    }
}

// operator key action - corresponds to 'op' in calc-fsm.txt
function onOp(op)
{
    switch (state.curr)
    {
        case 'START':
            // do nothing
            break
        case 'LNUM':
        case 'OP1':
        case 'EQ1':
            setState('OP1', op)
            break
        case 'RNUM':
            calc()
            setState('OP2', op)
            break
        case 'OP2':
        case 'EQ2':
            setState('OP2', op)
            break
    }
    updateDisplay()
}

// equals key action - corresponds to 'eq' in calc-fsm.txt
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
        case 'EQ2':
            state.lnum = state.result
            setState('EQ2')
            break
        case 'EQ1':
            // no change
            break
    }
    updateDisplay()
}

// calculate the result of the current operation
function calc()
{
    state.result = '' + operators[state.op](parseFloat(state.lnum), parseFloat(state.rnum))
}

// bind click listeners on all buttons
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

// bind global key-down listener and handle keys of interest
document.addEventListener('keydown', e => {
    let target
    if (e.key === 'Backspace') {
        switch (state.curr)
        {
            case 'LNUM':
                state.lnum = deleteDigit(state.lnum)
                break
            case 'RNUM':
                state.rnum = deleteDigit(state.rnum)
                break
            default:
                state.result = deleteDigit(state.result)
                break
        }
        updateDisplay()
        function deleteDigit(num) {
            if (num.length <= 1) {
                num = '0'
            } else {
                num = num.substring(0, num.length - 1)
            }
            return num
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

// style selector
const stylePicker = document.querySelector('#style-picker')
stylePicker.addEventListener('change', e =>
{
    console.dir(e)
    document.querySelector("head #style").href = e.target.value
})