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
  const [current, transition] = useStateMachine(H2OState)
  return (
    <div>
      <p>Your H2O is in a {current.state} state.</p>
      <p>The temperature of your H2O is {current.value}.</p>
      <button
        disabled={!transition.toLiquid}
        onClick={() => transition.toLiquid()}>
        To Liquid
      </button>
      <button
        disabled={!transition.toSolid}
        onClick={() => transition.freeze()}>
        To Solid
      </button>
      <button
        disabled={!transition.toGas}
        onClick={() => transition.boil()}>
        To Gas
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
    freeze: 'solid',
    boil: 'gas',
    value: '60F'
  },
  solid: {
    melt: 'liquid',
    value: '32F'
  },
  gas: {
    chill: 'liquid'
    value: '212F'
  }
})
```

## API

### useStateMachine

```js
import { useStateMachine } from 'use-state-machine'
```

`useStateMachine(machine: Object | StateMachine) -> [Object, Object]`

`useStateMachine` takes a JavaScript object or `StateMachine` Object as an argument and returns an array consisting of a `current` object and a `transition` object.


**`current -> Object`**

The `current` state consists of two properties: `state` and `value`.
`state` returns the string representing the current state. `value` returns the value (object or primitive) of the current state if one exists and returns `undefined` if not.

```js
const [ current ] = useStateMachine(H2OState)

current.state //-> 'liquid'
current.value //-> '60F'
```

**`transition -> Object`**

`transition` is an object with a collection of functions allowing the developer to avoid
transitioning using the string names. In the example above, when in the `liquid` state, two passive and two active functions exist on `transition`. The passive functions are `transition.toSolid`, `transition.toGas`. The two active functions are `transition.freeze` and `transition.boil`. All state specific functions on `transition` accept a single `value` argument.

If the value argument is an Object, the state's `value` and value argument will be merged. If the the state's `value` is not an Object, the state's `value` will be replaced with the value argument. If the state's `value` is a primitive and the value argument is an object, the state's `value` will be set to the value argument including a property named `value` set to the state's previous primitive value.

```js
const [ current, transition ] = useStateMachine(H2OState)
transition.freeze()

current.state //-> 'solid'
current.value //-> '32F'

transition.melt()

current.state //-> 'liquid'

transition.toGas()
```

### StateMachine

```js
import { StateMachine } from 'use-state-machine'
```

**`new StateMachine(states: Object) -> StateMachine`**

To create an instance of a StateMachine pass a 'states' object. A valid 'states' object must have, at a minimum, a single state. And an `initial` property which is set to a valid state property.

There are two types of `StateMachine` definitions: "active" and passive. If the definition includes names for each valid transition it is an "active" definition and the `transition` property will include "active" functions (like `freeze()` and `boild()`). An example of an "active" definition is:

```js
new StateMachine({
  initial: 'liquid',
  liquid: {
    freeze: 'solid',
    boil: 'gas',
    value: '60F'
  },
  solid: {
    melt: 'liquid',
    value: '32F'
  },
  gas: {
    chill: 'liquid'
    value: '212F'
  }
})
```

A "passive" definition uses the `to` property on each state indicating one or more valid states the current state can transition to. For a "passive" definition, the `transition` property will only include "passive" functions (like `toSolid` and `toGas`). An example of an "passive" definition is:

```js
new StateMachine({
  initial: 'liquid',
  liquid: {
    to: ['solid', 'gas']
    value: '60F'
  },
  solid: {
    to: 'liquid'
    value: '32F'
  },
  gas: {
    to: 'liquid'
    value: '212F'
  }
})
```


**`<StateMachine>.state -> String`**

Return the string name of the `StateMachine` state.


**`<StateMachine>.value -> Any`**

`value` returns the value (object or primitive) of the current state if one exists and returns `undefined` if not.


**`<StateMachine>.transition -> Object`**

`transition` is an object with a collection of functions allowing the developer to avoid
transitioning using the string names. In the example above, when in the `liquid` state, two passive and two active functions exist on `transition`. The passive functions are `transition.toSolid`, `transition.toGas`. The two active functions are `transition.freeze` and `transition.boil`. All state specific functions on `transition` accept a single `value` argument.

If the value argument is an Object, the state's `value` and value argument will be merged. If the the state's `value` is not an Object, the state's `value` will be replaced with the value argument. If the state's `value` is a primitive and the value argument is an object, the state's `value` will be set to the value argument including a property named `value` set to the state's previous primitive value.

**`<StateMachine>.onTransition(callback: Function) -> unsubscribe: Function`**

When a `StateMachine` object transitions from one state to another all callbacks passed to the `onTransition` function are evaluated with the `StateMachine` object passed as the only argument to the callback. `onTransition` returns a function that unsubscribes the callback when executed.

## Maintainers

* Mark Stahl

## License

MIT
