import React from 'react'
import { useStateMachine, StateMachine } from '../index'

const H2OState = new StateMachine({
  initial: 'liquid',
  liquid: {
    freeze: 'solid',
    boil: 'gas',
    value: '60F'
  },
  solid: {
    to: ['liquid'],
    value: '32F'
  },
  gas: {
    to: 'liquid',
    value: '212F'
  }
})

export default function H2O () {
  const [current, transition] = useStateMachine(H2OState)
  return (
    <div>
      <p data-testid='state'>
        Your H2O is in a {current.state} state.
      </p>
      <p data-testid='temp'>
        The temperature of your H2O is {current.value}.
      </p>
      <button data-testid='liquid'
        disabled={!transition.toLiquid}
        onClick={() => transition.toLiquid()}>
        To Liquid
      </button>
      <button data-testid='solid'
        disabled={!transition.toSolid}
        onClick={() => transition.freeze()}>
        To Solid
      </button>
      <button data-testid='gas'
        disabled={!transition.toGas}
        onClick={() => transition.boil()}>
        To Gas
      </button>
    </div>
  )
}
