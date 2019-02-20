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
  expect(Object.keys(state.transition).includes('toSolid')).toBeTruthy()
})

test('states must specify a valid initial state', () => {
  let states = {
    liquid: {}
  }
  expect(() => new StateMachine(states)).toThrow()
  states = {
    initial: 'solid',
    liquid: {}
  }
  expect(() => new StateMachine(states)).toThrow()
})

test('transition to a new state', () => {
  const state = new StateMachine(H2O())
  state.transition.toSolid()
  expect(state.state).toBe('solid')
  expect(state.value).toBe('32F')
  expect(Object.keys(state.transition).includes())
  expect(Object.keys(state.transition).includes('toLiquid', 'toGas')).toBeTruthy()
})

test('transition is also an object with state functions', () => {
  const state = new StateMachine(H2O())
  state.transition.toSolid()
  expect(state.state).toBe('solid')
  expect(state.value).toBe('32F')

  state.transition.toLiquid('65F')
  expect(state.state).toBe('liquid')
  expect(state.value).toBe('65F')
})

test('update primitive value with a primitive', () => {
  const state = new StateMachine(H2O())
  state.transition.toSolid('30F')
  expect(state.value).toBe('30F')
})

test('update primitive value with an object', () => {
  const state = new StateMachine(H2O())
  state.transition.toSolid({ knownAs: 'water' })
  expect(state.value).toEqual({ knownAs: 'water', value: '32F' })
})

test('update object value with an object', () => {
  const state = new StateMachine(H2O())
  state.transition.toSolid()
  state.transition.toGas({ temp: '213F' })
  expect(state.value).toEqual({ knownAs: 'steam', temp: '213F' })
})

test('states without to states can transition to all states', () => {
  const state = new StateMachine({
    initial: 'liquid',
    liquid: {
      freeze: 'solid',
      boil: 'gas',
      value: '60F'
    },
    solid: {
      warm: 'liquid',
      value: '32F'
    },
    gas: {
      chill: 'liquid',
      value: '212F'
    }
  })
  expect(Object.keys(state.transition).includes('toSolid', 'toGas', 'freeze', 'boild')).toBeTruthy()

  state.transition.toGas()
  expect(Object.keys(state.transition).includes('toLiquid', 'chill')).toBeTruthy()
  expect(state.state).toBe('gas')
})
