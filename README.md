[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Build Status](https://travis-ci.com/mjstahl/use-state-machine.svg?branch=master)](https://travis-ci.com/mjstahl/use-state-machine)

# use-state-machine
Use Finite State Machines with React Hooks

* [Installation](#installation)
* [Example](#example)
* [API](#api)
* [Maintainers](#maintainers)
* [License](#license)

## Installation

```shell
$ npm install --save use-state-machine
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

## API

```js
import { useStateMachine, StateMachine } from 'use-state-machine'
```

`useStateMachine(machine: Object | Stated) -> [Object, Function, Object]`

`useStateMachine` takes a JavaScript object or Stated Object as an argument and returns an array consisting of a `current` object, a `transition` function, and a `to` object.

The `current` state consists of three properties: `state`, `value`, and `via`.
`state` returns the string representing the current state. `value` returns the value (object or primitive) of the current state if one exists and returns `undefined` if not. `via` returns an object with `to` strings as properties and the state string each points to as values.

```js
const [ current ] = useStateMachine(H2OState)

current.state //-> 'liquid'
current.value //-> '60F'
current.via   //-> { NEXT_STATE: 'solid' }
```


`transition(action: String[, updateWith: Any]) -> undefined`

The `transition` function transitions from the current state of the state machine to a new state. If called with a second argument, the `value` of the new state will be updated with the `updateWith` value. If the `updateWith` value is an Object, the state's value and `updateWith` value will be merged. If the `updateWith` value is not an Object, value will be replaced with the `updateWith` value.

```js
const [ current, transition, to ] = useStateMachine(H2OState)
transition(to.NEXT_STATE)

current.state //-> 'solid'
current.value //-> '32F'
current.via   //-> { 'NEXT_STATE': 'gas' }
```

The `to` object returns an object with actions as properties and associated values. `to` should be used to transition between states to avoid typos.

```js
const [, transition, to ] = useStateMachine(H2OState)
transition(to.NEXT_STATE)

to //-> { 'NEXT_STATE': 'NEXT_STATE' }
```


`new StateMachine(states: Object[, persistant: Boolean]) -> Stated`

Refer to [@mjstahl/stated](https://github.com/mjstahl/stated#api) for an overview of the Stated object and its API.

## Maintainers

* Mark Stahl

## License

MIT
