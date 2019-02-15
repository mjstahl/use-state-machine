const { useState } = require('react')
const StateMachine = require('./machine')

function useStateMachine (states) {
  const machine = (states instanceof StateMachine)
    ? states
    : new StateMachine(states)
  const [, setState] = useState(machine.value)

  machine.onTransition((machine) => {
    setState(machine.value)
  })

  const { state, to, transition, value } = machine
  return [{ state, value }, transition, to]
}

module.exports = { StateMachine, useStateMachine }
