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
      <button
        disabled={!transition.toLiquid}
        onClick={() => transition.toLiquid()}>
        To {to.liquid}
      </button>
      <button
        disabled={!transition.toSolid}
        onClick={() => transition.toSolid()}>
        To {to.solid}
      </button>
      <button
        disabled={!transition.toGas}
        onClick={() => transition.toGas()}>
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
  solid: {
    to: 'liquid',
    value: '32F'
  },
  liquid: {
    to: ['gas', 'solid'],
    value: '60F'
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

`useStateMachine(machine: Object | StateMachine) -> [Object, Function, Object]`

`useStateMachine` takes a JavaScript object or Stated Object as an argument and returns an array consisting of a `current` object, a `transition` function, and a `to` object.

The `current` state consists of two properties: `state` and `value`.
`state` returns the string representing the current state. `value` returns the value (object or primitive) of the current state if one exists and returns `undefined` if not.

```js
const [ current ] = useStateMachine(H2OState)

current.state //-> 'liquid'
current.value //-> '60F'
```


`transition(action: String[, updateWith: Any]) -> undefined`

The `transition` function transitions from the current state of the state machine to a new state. If called with a second argument, the `value` of the new state will be updated with the `updateWith` value.

If the `updateWith` value is an Object, the state's value and `updateWith` value will be merged. If the `updateWith` value is not an Object, value will be replaced with the `updateWith` value. If the state's value is a primitive and `updateWith` is an object, the state's value will be set to `updateWith` which will include a property named `value` set to the state's previous primitive value.

`transition` is also an object with a collection of functions allowing the developer to avoid
transitioning using string names. In the example above, when in the `liquid` state, two functions exist on `transition`: `transition.toSolid` and `transition.toGas`. All state specific functions on `transition` accept a single `valu`.

```js
const [ current, transition, to ] = useStateMachine(H2OState)
transition(to.solid)

current.state //-> 'solid'
current.value //-> '32F'

transition.toLiquid()

current.state //-> 'liquid'

transition.toGas()
```

The `to` property returns an object with the states as property names and values. `to` should be used to transition between states to avoid typos.

```js
const [, transition, to ] = useStateMachine(H2OState)
transition(to.solid)

to //-> { 'liquid': 'liquid', 'gas': 'gas' }
```


`new StateMachine(states: Object) -> StateMachine`

To create an instance of a StateMachine pass a 'states' object. A valid 'states' object must have, at a minimum, a single state. And an `initial` property which is set to a valid state property.


`<StateMachine>.state -> String`

Return the StateMachine's current state.


`<StateMachine>.to -> Object`

The `to` property returns an object with the states as property names and values. `to` should be used to transition between states to avoid typos.


`<StateMachine>.value -> Any`

`value` returns the value (object or primitive) of the current state if one exists and returns `undefined` if not.


`<StateMachine>.transition(action: String[, updateWith: Any]) -> undefined`

The `transition` function transitions from the current state of the state machine to a new state. If called with a second argument, the `value` of the new state will be updated with the `updateWith` value.

If the `updateWith` value is an Object, the state's value and `updateWith` value will be merged. If the `updateWith` value is not an Object, value will be replaced with the `updateWith` value. If the state's value is a primitive and `updateWith` is an object, the state's value will be set to `updateWith` which will include a property named `value` set to the state's previous primitive value.

## Maintainers

* Mark Stahl

## License

MIT
