import { afterEach, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from "@testing-library/jest-dom/matchers"
import { expect } from 'vitest'
import { vi } from 'vitest'

expect.extend(matchers)

beforeEach(() => {
    vi.clearAllMocks()
})

afterEach(() => {
    cleanup()
})

export { render, screen, fireEvent, waitFor, within }