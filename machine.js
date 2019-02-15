const autobind = require('./autobind')

class StateMachine {
  constructor (states) {
    autobind(this)

    this._handlers = []
    this._states = states

    if (states.initial) {
      this.__transition(states.initial)
    } else {
      throw new Error('An "initial" property must specify a valid state.')
    }
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

  get to () {
    let possible = this._states[this.state].to
    if (!possible || !possible.length) {
      possible = Object.keys(this._states).filter(p => p !== 'initial')
    }
    if (!Array.isArray(possible)) possible = [possible]
    return possible.reduce((to, p) => Object.assign(to, { [p]: p }), {})
  }

  get transition () {
    const capitalize = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
    const func = this._transition
    Object.keys(func).forEach(k => delete func[k])

    Object.keys(this.to).reduce((fn, state) => {
      fn[`to${capitalize(state)}`] = ((to) => {
        return (updateValue) => this._transition(to, updateValue)
      })(state)
      return fn
    }, func)
    return func
  }

  onTransition (cb) {
    this._handlers.push(cb)
    return () => {
      return void this._handlers.splice(this._handlers.indexOf(cb) >>> 0, 1)
    }
  }

  _transition (to, updateValue) {
    const available = Object.keys(this.to).includes(to)
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

module.exports = StateMachine
