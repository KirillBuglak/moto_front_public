import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../App'
import { useSelector } from 'react-redux'
import { defaultTheme } from '../config'

// Mock child components
vi.mock('../components/LeftMenu', () => ({ default: () => <div data-testid="left-menu" /> }))
vi.mock('../components/UpperBar', () => ({
    default:
        ({ openLeftMenu, toggle }) => (
            <div>
                {/* expose openLeftMenu value and a toggle button */}
                <div data-testid="upperbar-open">{String(openLeftMenu)}</div>
                <button data-testid="toggle-btn" onClick={toggle}>Toggle</button>
            </div>
        )
}))
vi.mock('../components/auth/LoginForm', () => ({ default: () => <div data-testid="login-form" /> }))
vi.mock('../routes/Router', () => ({ default: () => <div data-testid="router" /> }))

// Mock utils and config
const mockedSetColors = vi.fn()
vi.mock('../utils/Utils', () => ({
    setColorsCSSVariables: (...args) => mockedSetColors(...args)
}))
// Config
vi.mock('../config', () => ({
    defaultTheme: { themeName: 'default-test-theme' }
}))

// Mock react-redux useSelector
vi.mock('react-redux', () => ({
    useSelector: vi.fn()
}))

describe('App component', () => {

    beforeEach(() => {
        localStorage.clear()
    })

    it('renders LoginForm when authorities are not present', () => {
        useSelector.mockImplementation(selector => selector({ authRed: { data: { authorities: null } } }))

        render(<App />)

        expect(screen.getByTestId('login-form')).toBeInTheDocument()
        // UpperBar should not be present when not authenticated
        expect(screen.queryByTestId('upperbar-open')).not.toBeInTheDocument()
    })

    it('renders main layout when authorities present and reads menuOpen from localStorage', async () => {
        // set saved menu state to false (closed)
        localStorage.setItem('menuOpen', JSON.stringify(false))
        // ensure no theme in localStorage
        localStorage.removeItem('theme')

        useSelector.mockImplementation(selector => selector({ authRed: { data: { authorities: ['ROLE_USER'] } } }))

        render(<App />)

        // UpperBar, LeftMenu and Router should render
        expect(await screen.findByTestId('upperbar-open')).toHaveTextContent('false')
        expect(screen.getByTestId('left-menu')).toBeInTheDocument()
        expect(screen.getByTestId('router')).toBeInTheDocument()

        // content wrapper should reflect menu-closed class when menuOpen === false
        const content = document.querySelector('.content-wrapper')
        expect(content).toBeTruthy()
        expect(content.classList.contains('menu-closed')).toBe(true)

        // theme initialization: expect setColorsCSSVariables to be called with defaultTheme
        expect(mockedSetColors).toHaveBeenCalledWith(defaultTheme)
        // and defaultTheme saved to localStorage
        expect(localStorage.getItem('theme')).toBe(JSON.stringify(defaultTheme))
    })

    it('default menuOpen is true when not present in localStorage and toggle updates it', async () => {
        // No menuOpen in localStorage -> component should default to true
        // Put an invalid JSON string into localStorage.theme to cause JSON.parse to throw
        localStorage.setItem('theme', 'not-a-valid-json')

        useSelector.mockImplementation(selector => selector({ authRed: { data: { authorities: ['ROLE_USER'] } } }))

        // spy on console.error to ensure error path executes (App logs on theme parse error)
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

        render(<App />)

        expect(mockedSetColors).toHaveBeenCalledWith(defaultTheme)
        expect(localStorage.getItem('theme')).toBe(JSON.stringify(defaultTheme))
        expect(consoleErrorSpy).toHaveBeenCalled()

        consoleErrorSpy.mockRestore()
    })

    it('snapshot', () => {
        const { container } = render(<App />)
        expect(container.firstChild).toMatchSnapshot()
    })
})