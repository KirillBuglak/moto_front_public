import { screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LeftMenu from '../components/LeftMenu'
import { renderWithProviders } from './testUtils'

// Mock react-router navigate using importOriginal to preserve other exports like BrowserRouter
const navigateMock = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        useNavigate: () => navigateMock
    }
})

// Config
vi.mock('../config', () => ({
    appConfig: [
        {
            children: [
                {
                    title: 'parentTitle',
                    path: 'parent',
                    icon: <span>ICON_PARENT</span>,
                    children: [
                        {
                            title: 'childTitle',
                            path: 'child',
                            icon: <span>ICON_CHILD</span>
                        }
                    ]
                },
                {
                    title: 'singleTitle',
                    path: 'single',
                    icon: <span>ICON_SINGLE</span>
                }
            ]
        }
    ]
}))

describe('LeftMenu', () => {
    it('renders root items and toggles children when clicked', async () => {
        renderWithProviders(<LeftMenu open={true} />)

        // Parent icon and single item icons present
        expect(screen.getByText('ICON_PARENT')).toBeInTheDocument()
        expect(screen.getByText('ICON_SINGLE')).toBeInTheDocument()

        // Child icon should not be in the document initially
        expect(screen.queryByText('ICON_CHILD')).not.toBeInTheDocument()

        // Click the parent top-menu-item to open children
        // The clickable element contains the parent title text via <p>{t(item.title)}</p>
        const parentTitleEl = screen.getByText('parentTitle')
        fireEvent.click(parentTitleEl)

        // After clicking parent, child icon should appear
        await waitFor(() => {
            expect(screen.getByText('ICON_CHILD')).toBeInTheDocument()
        })

        // Click the child item (leaf) to navigate
        const childTitleEl = screen.getByText('childTitle')
        fireEvent.click(childTitleEl)

        // navigate should have been called with the built full path '/parent/child'
        expect(navigateMock).toHaveBeenCalledWith('/parent/child')

        // Click the parent again to close child
        fireEvent.click(parentTitleEl)
        await waitFor(() => {
            expect(screen.queryByText('ICON_CHILD')).not.toBeInTheDocument()
        })
    })

    it('applies open/closed class based on "open" prop', () => {
        const { container: c1 } = renderWithProviders(<LeftMenu open={true} />)
        expect(c1.querySelector('.left-menu')).toHaveClass('open')

        const { container: c2 } = renderWithProviders(<LeftMenu open={false} />)
        expect(c2.querySelector('.left-menu')).toHaveClass('closed')
    })

    it('builds proper full path when parentPaths include "/" or empty segments', async () => {
        // Reset modules to allow re-mocking config for this test
        vi.resetModules()

        // Mock config with a custom setup for this test
        vi.doMock('../config', () => ({
            appConfig: [
                {
                    children: [
                        {
                            title: 'root',
                            path: '/',
                            icon: <span>ROOT_ICON</span>,
                            children: [
                                {
                                    title: 'nested',
                                    path: 'nested',
                                    icon: <span>NESTED_ICON</span>
                                }
                            ]
                        }
                    ]
                }
            ]
        }))

        // Dynamically import LeftMenu after mocks are set
        const { default: LeftMenuLocal } = await import('../components/LeftMenu')

        renderWithProviders(<LeftMenuLocal open={true} />)

        // Open the root to reveal nested
        fireEvent.click(screen.getByText('root'))
        await waitFor(() => {
            expect(screen.getByText('NESTED_ICON')).toBeInTheDocument()
        })

        // Click nested to navigate, expected full path should be '/nested' (root path '/' is ignored)
        fireEvent.click(screen.getByText('nested'))
        expect(navigateMock).toHaveBeenCalledWith('/nested')
    })

    it('snapshot', () => {
        const { container } = renderWithProviders(<LeftMenu open={true} />)
        expect(container.firstChild).toMatchSnapshot()
    })
})
