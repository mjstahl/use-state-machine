# use-state-machine
Use Finite State Machines with React Hooks

## Installation

```shell
$ npm install --save use-state-machine
```

```js
import { useStateMachine, StateMachine } from 'use-state-machine'
```

## Example

```js
// H2O.js
import React from 'react'
import { useStateMachine } from 'use-state-machine'
import H2OState from './H2O.state'

function H2O () {
  const [current, transition, to] = useStateMachine(H2OState)
  return (
    <div>
      <p>Your H2O is in a {current.state} state.</p>
      <p>The temperature of your H2O is {current.value}.</p>
      <button onClick={() => transition(to.NEXT_STATE)}>
        To {current.via.NEXT_STATE}
      </button>
    </div>
  )
}
```

```js
// H2O.state.js
import { StateMachine } from 'use-state-machine'

export default new StateMachine({
  initial: 'liquid',
  liquid: {
    NEXT_STATE: 'solid',
    value: '60F'
  },
  solid: {
    NEXT_STATE: 'gas',
    value: '32F'
  },
  gas: {
    NEXT_STATE: 'liquid',
    value: '212F'
  }
})
```