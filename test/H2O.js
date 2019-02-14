import React from 'react'
import { useStateMachine, StateMachine } from '../index'

const H2OState = new StateMachine({
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

export default function H2O () {
  const [current, transition, to] = useStateMachine(H2OState)
  return (
    <div>
      <p data-testid='state'>Your H2O is in a {current.state} state.</p>
      <p data-testid='temp'>The temperature of your H2O is {current.value}.</p>
      <button data-testid='transition' onClick={() => transition(to.NEXT_STATE)}>
        To {current.via.NEXT_STATE}
      </button>
    </div>
  )
}
