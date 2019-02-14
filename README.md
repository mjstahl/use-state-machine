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
  const isDisabled = (state) => !Object.keys(to).includes(state)
  return (
    <div>
      <p>Your H2O is in a {current.state} state.</p>
      <p>The temperature of your H2O is {current.value}.</p>
      <button
        disabled={isDisabled(to.liquid)}
        onClick={() => transition(to.liquid)}>
        To {to.liquid}
      </button>
      <button
        disabled={isDisabled(to.solid)}
        onClick={() => transition(to.solid)}>
        To {to.solid}
      </button>
      <button
        disabled={isDisabled(to.solid)}
        onClick={() => transition(to.gas)}>
        To {to.gas}
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
    to: ['solid'],
    value: '60F'
  },
  solid: {
    to: ['liquid', 'gas'],
    value: '32F'
  },
  gas: {
    to: 'liquid',
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

The `current` state consists of two properties: `state` and `value`.
`state` returns the string representing the current state. `value` returns the value (object or primitive) of the current state if one exists and returns `undefined` if not.

```js
const [ current ] = useStateMachine(H2OState)

current.state //-> 'liquid'
current.value //-> '60F'
```


`transition(action: String[, updateWith: Any]) -> undefined`

The `transition` function transitions from the current state of the state machine to a new state. If called with a second argument, the `value` of the new state will be updated with the `updateWith` value. If the `updateWith` value is an Object, the state's value and `updateWith` value will be merged. If the `updateWith` value is not an Object, value will be replaced with the `updateWith` value.

```js
const [ current, transition, to ] = useStateMachine(H2OState)
transition(to.NEXT_STATE)

current.state //-> 'solid'
current.value //-> '32F'
```

The `to` object returns an object with actions as properties and associated values. `to` should be used to transition between states to avoid typos.

```js
const [, transition, to ] = useStateMachine(H2OState)
transition(to.solid)

to //-> { 'liquid': 'liquid', 'gas': 'gas' }
```


`new StateMachine(states: Object[, persistant: Boolean]) -> StateMachine`



## Maintainers

* Mark Stahl

## License

MIT
