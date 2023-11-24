import { render /*,screen*/ } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import App from './App'

describe('App test', () => {
  test('should render successfully', () => {
    const { baseElement } = render(<App />)
    expect(baseElement).toBeTruthy()
  })

  //   test('should render successfully', () => {
  //     render(<App />)
  //     expect(screen.getByText(/Welcome/i)).toBeDefined()
  //   })
})
