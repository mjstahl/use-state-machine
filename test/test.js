import 'babel-polyfill'
import React from 'react'
import {
  fireEvent,
  render,
  wait
} from 'react-testing-library'

import './machine'
import H2O from './H2O'

function testParagraphsWith (test, ids, values) {
  ids.map((id, index) => {
    expect(test(id).innerHTML).toContain(values[index])
  })
}

const ids = ['state', 'temp']

test('initial rendering', () => {
  const { getByTestId } = render(<H2O />)
  testParagraphsWith(getByTestId, ids, ['liquid', '60F'])
  expect(getByTestId('liquid').disabled).toBeTruthy()
  expect(getByTestId('solid').disabled).toBeFalsy()
  expect(getByTestId('gas').disabled).toBeFalsy()
})

test('transition', async () => {
  const { getByTestId } = render(<H2O />)
  fireEvent.click(getByTestId('solid'))
  await wait(() => {
    testParagraphsWith(getByTestId, ids, ['solid', '32F'])
    expect(getByTestId('solid').disabled).toBeTruthy()
    expect(getByTestId('liquid').disabled).toBeFalsy()
    expect(getByTestId('gas').disabled).toBeTruthy()
  })
})

test('transition again', async () => {
  const { getByTestId } = render(<H2O />)
  fireEvent.click(getByTestId('liquid'))
  await wait(() => {
    testParagraphsWith(getByTestId, ids, ['liquid', '60F'])
    expect(getByTestId('gas').disabled).toBeFalsy()
    expect(getByTestId('liquid').disabled).toBeTruthy()
    expect(getByTestId('solid').disabled).toBeFalsy()
  })
})
