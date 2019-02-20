const autobind = require('./autobind')
const camelCase = require('lodash.camelcase')
const capitalize = require('lodash.capitalize')

module.exports = class StateMachine {
  constructor (states) {
    autobind(this)

    const initial = states.initial
    if (!initial || !states[initial]) {
      throw new Error('An "initial" property must specify a valid state.')
    }

    this._handlers = []
    this._states = states
    this.__transition(initial)
  }

  get value () {
    return this._states[this.state].value
  }

  set value (update) {
    const value = this._states[this.state].value
    const valueIsObject =
      Object.getPrototypeOf(value) === Object.prototype
    const updateIsValue =
      Object.getPrototypeOf(update) === Object.prototype
    if (valueIsObject && updateIsValue) {
      Object.assign(value, update)
    } else if (!valueIsObject && updateIsValue) {
      this._states[this.state].value =
        Object.assign({ 'value': value }, update)
    } else {
      this._states[this.state].value = update
    }
  }

  get transition () {
    const fns = {}
    Object.keys(fns).forEach(k => delete fns[k])

    this._possibleStates.reduce((fns, state) => {
      fns[`to${capitalize(camelCase(state))}`] = ((to) => {
        return (updateValue) => this._transition(to, updateValue)
      })(state)
      return fns
    }, fns)
    Object.keys(this._actions).reduce((fns, action) => {
      fns[action] = ((to) => {
        return (updateValue) => this._transition(to, updateValue)
      })(this._actions[action])
      return fns
    }, fns)
    return fns
  }

  onTransition (cb) {
    this._handlers.push(cb)
    return () => {
      return void this._handlers.splice(this._handlers.indexOf(cb) >>> 0, 1)
    }
  }

  get _actions () {
    const state = this._states[this.state]
    return Object.keys(state)
      .filter(p => !['value', 'to'].includes(p))
      .reduce((actions, a) => {
        actions[a] = state[a]
        return actions
      }, {})
  }

  get _possibleStates () {
    const state = this._states[this.state]
    let possible = state.to
    if (!possible || !possible.length) {
      possible = Object.values(this._actions)
    }
    if (!Array.isArray(possible)) possible = [possible]
    return possible
  }

  _transition (to, updateValue) {
    const available = this._possibleStates.includes(to)
    if (!available) {
      throw new Error(`"${to}" does not exist as an action of "${this.state}"`)
    }
    if (!this._states[to]) {
      throw new Error(`"${to}" does not exist`)
    }
    this.__transition(to, updateValue)
  }

  __transition (state, updateValue) {
    this.state = state
    if (updateValue) this.value = updateValue
    this._handlers.forEach(h => h(this))
  }
}
