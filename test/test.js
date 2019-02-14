import 'babel-polyfill'
import React from 'react'
import {
  fireEvent,
  render,
  wait
} from 'react-testing-library'

import H2O from './H2O'

function testElementsWith (test, ids, values) {
  ids.map((id, index) => {
    expect(test(id).innerHTML).toContain(values[index])
  })
}

const ids = ['state', 'temp', 'transition']

test('initial rendering', () => {
  const { getByTestId } = render(<H2O />)
  const values = ['liquid', '60F', 'To solid']
  testElementsWith(getByTestId, ids, values)
})

test('transition to new state', async () => {
  const { getByTestId } = render(<H2O />)
  fireEvent.click(getByTestId('transition'))
  await wait(() => {
    const values = ['solid', '32F', 'To gas']
    testElementsWith(getByTestId, ids, values)
  })
})

test('transition to the next state', async () => {
  const { getByTestId } = render(<H2O />)
  fireEvent.click(getByTestId('transition'))
  await wait(() => {
    const values = ['gas', '212F', 'To liquid']
    testElementsWith(getByTestId, ids, values)
  })
})
