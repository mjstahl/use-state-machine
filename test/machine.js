import StateMachine from '../machine'

function H2O () {
  return {
    initial: 'liquid',
    liquid: {
      to: 'solid',
      value: '60F'
    },
    solid: {
      to: ['gas', 'liquid'],
      value: '32F'
    },
    gas: {
      to: 'liquid',
      value: {
        temp: '212F',
        knownAs: 'steam'
      }
    }
  }
}

test('newly created instance', () => {
  const state = new StateMachine(H2O())
  expect(state.state).toBe('liquid')
  expect(state.value).toBe('60F')
  expect(state.to).toEqual({ 'solid': 'solid' })
})

test('transition to a new state', () => {
  const state = new StateMachine(H2O())
  state.transition(state.to.solid)
  expect(state.state).toBe('solid')
  expect(state.value).toBe('32F')
  expect(state.to).toEqual({ 'gas': 'gas', 'liquid': 'liquid' })
})

test('update primitive value with a primitive', () => {
  const state = new StateMachine(H2O())
  state.transition(state.to.solid, '30F')
  expect(state.value).toBe('30F')
})

test('update primitive value with an object', () => {
  const state = new StateMachine(H2O())
  state.transition(state.to.solid, { knownAs: 'water' })
  expect(state.value).toEqual({ knownAs: 'water', value: '32F' })
})

test('update object value with an object', () => {
  const state = new StateMachine(H2O())
  state.transition(state.to.solid)
  state.transition(state.to.gas, { temp: '213F' })
  expect(state.value).toEqual({ knownAs: 'steam', temp: '213F' })
})

test('states without to states can transition to all states', () => {
  const state = new StateMachine({
    initial: 'liquid',
    liquid: {
      value: '60F'
    },
    solid: {
      value: '32F'
    },
    gas: {
      value: '212F'
    }
  })
  expect(state.to).toEqual({ 'liquid': 'liquid', 'solid': 'solid', 'gas': 'gas' })
  state.transition(state.to.gas)
  expect(state.state).toBe('gas')
})
