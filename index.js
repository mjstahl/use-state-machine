const { Stated } = require('@mjstahl/stated')
const { useState } = require('react')

function useStateMachine (states) {
  const machine = (states instanceof Stated) ? states : new Stated(states)
  const [, setState] = useState(machine.value)

  machine.onTransition((updated) => setState(updated.value))

  // defined to override the Stated behavior to NOT return
  // a Stated object
  function transition () { machine.to(...arguments) }

  const { actions, state, value, via } = machine
  // [ current, transition, to ]
  return [{ state, value, via }, transition, actions]
}

module.exports = { StateMachine: Stated, useStateMachine }
