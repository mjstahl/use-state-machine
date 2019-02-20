const { useState } = require('react')
const StateMachine = require('./machine')

function useStateMachine (states) {
  const machine = (states instanceof StateMachine)
    ? states : new StateMachine(states)
  const [, setState] = useState(machine.value)

  machine.onTransition((machine) => setState(machine.value))

  const { state, transition, value } = machine
  return [{ state, value }, transition]
}

module.exports = { StateMachine, useStateMachine }
