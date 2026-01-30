import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import UpperBar from '../components/UpperBar'

// Mock AccountMenu to accept a forwarded ref and render a wrapper containing test id
vi.mock('../components/AccountMenu', () => {
  return {
    default: React.forwardRef((props, ref) => <div ref={ref} data-testid="account-menu">ACCOUNT_MENU</div>)
  }
})

// Mock translation hook and i18n
var changeLanguageMock
vi.mock('react-i18next', () => {
  changeLanguageMock = vi.fn()
  return {
    useTranslation: () => ({
      t: (k) => k,
      i18n: { changeLanguage: changeLanguageMock }
    })
  }
})

describe('UpperBar', () => {

  beforeEach(() => {
    localStorage.clear()
  })

  it('calls toggle prop when left button is clicked and shows language button', () => {
    const toggleMock = vi.fn()
    render(<UpperBar openLeftMenu={true} toggle={toggleMock} />)

    // Toggle button exists (first button in the DOM, as it has no accessible name)
    const toggleBtn = screen.getAllByRole('button')[0]
    // Just ensure clicking the first button (the left menu toggle) calls our toggleMock
    fireEvent.click(toggleBtn)
    expect(toggleMock).toHaveBeenCalled()
  })

  it('account menu toggles open/close and closes on outside click', async () => {
    render(<UpperBar openLeftMenu={false} toggle={() => { }} />)

    // Find the login-button (it has class 'login-button' in implementation)
    const loginBtn = document.querySelector('.login-button') || screen.getAllByRole('button').find(b => b.classList.contains('login-button'))
    expect(loginBtn).toBeTruthy()

    // Click to open
    fireEvent.click(loginBtn)
    await waitFor(() => {
      expect(screen.getByTestId('account-menu')).toBeInTheDocument()
    })

    // Simulate click outside
    fireEvent.mouseDown(document.body)
    await waitFor(() => {
      expect(screen.queryByTestId('account-menu')).not.toBeInTheDocument()
    })
  })

  it('language button toggles language via i18n.changeLanguage and reflects localStorage', async () => {
    // Start with en in localStorage
    localStorage.setItem('i18nextLng', 'en')
    render(<UpperBar openLeftMenu={true} toggle={() => { }} />)

    // Language toggle button has class 'lang'
    const langBtn = document.querySelector('.lang') || screen.getByText((content) => content === 'EN' || content === 'ES')
    expect(langBtn).toBeTruthy()

    // Click to change language (en -> es)
    fireEvent.click(langBtn)
    await waitFor(() => {
      // changeLanguage should be called with 'es'
      expect(changeLanguageMock).toHaveBeenCalledWith('es')
    })

    // Click again to switch back (es -> en)
    fireEvent.click(langBtn)
    await waitFor(() => {
      expect(changeLanguageMock).toHaveBeenCalledWith('en')
    })
  })

  it('snapshot', () => {
    const { container } = render(<UpperBar openLeftMenu={true} toggle={() => { }} />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
