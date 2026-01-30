import { describe, it, expect } from 'vitest'
import LoginForm from '../components/auth/LoginForm'
import { renderWithProviders } from './testUtils'

// A very small smoke test for LoginForm to ensure it renders without throwing.
// This test is intentionally non-prescriptive because LoginForm may depend on app context,
// translations or other providers. The goal is to detect regressions where the component
// cannot render at all.

describe('LoginForm (smoke)', () => {
    it('renders without crashing and contains at least one interactive element', () => {
        const { container } = renderWithProviders(<LoginForm />)
        // The component should render some DOM
        expect(container.firstChild).not.toBeNull()

        // Look for a form, or an input, or a button — at least one should exist
        const formEl = container.querySelector('form')
        const inputEl = container.querySelector('input')
        const buttonEl = container.querySelector('button')

        expect(formEl || inputEl || buttonEl).toBeTruthy()
    })

    it('snapshot', () => {
        const { container } = renderWithProviders(<LoginForm />)
        expect(container.firstChild).toMatchSnapshot()
    })
})
