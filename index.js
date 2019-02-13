const { Stated } = require('@mjstahl/stated')
const { useState } = require('react')

function useStateMachine (states) {
  const machine = (states instanceof Stated) ? states : new Stated(states)
  const [state, setState] = useState(machine.value)

  state.onTransition((updated) => setState(updated.value))

  const current = { state: machine.state, value: machine.value }
  return [current, machine.to, machine.actions ]
}

module.exports = { StateMachine: Stated, useStateMachine }
