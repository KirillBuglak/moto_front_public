import { afterEach, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from "@testing-library/jest-dom/matchers"
import { expect } from 'vitest'
import { vi } from 'vitest'

const mockLocalStorage = () => {
  let store = {}
  
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = String(value)
    }),
    removeItem: vi.fn((key) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    length: 0,
    key: vi.fn((index) => Object.keys(store)[index] || null),
  }
}

global.localStorage = mockLocalStorage()

expect.extend(matchers)

beforeEach(() => {
    vi.clearAllMocks()
})

afterEach(() => {
    cleanup()
})

export { render, screen, fireEvent, waitFor, within }