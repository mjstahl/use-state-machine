const { useState } = require('react')
const StateMachine = require('./machine')

function useStateMachine (states) {
  const machine = (states instanceof StateMachine)
    ? states
    : new StateMachine(states)
  const [, setState] = useState(machine.value)

  function transition () {
    machine.transition(...arguments)
    setState(machine.value)
  }

  const { state, to, value } = machine
  return [{ state, value }, transition, to]
}

module.exports = { StateMachine, useStateMachine }
