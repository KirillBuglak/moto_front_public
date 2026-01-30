import { describe, it, expect,  vi } from 'vitest'
import { setColorsCSSVariables } from '../utils/Utils'

describe('Utils - setColorsCSSVariables', () => {

    it('throw on empty input', () => {
        expect(typeof setColorsCSSVariables).toBe('function')
        expect(() => setColorsCSSVariables(undefined)).toThrow()
    })

    it('attempts to set CSS variables on documentElement when given a theme object', () => {
        // Spy on setProperty so we can detect calls even if we don't know exact variable names
        const spy = vi.spyOn(document.documentElement.style, 'setProperty')

        const theme = {
            chosenOption: 'light',
            'light-colors': {
                headerFirst: '#ffffff',
                headerSecond: '#eeeeee',
                primary: '#ff0000',
                secondary: '#00ff00',
                layout: '#cccccc',
                success: '#00ff00',
                cancel: '#ff0000',
                notification: '#ffff00',
                button: '#0000ff'
            }
        }

        setColorsCSSVariables(theme)

        // Expect that setProperty has been called at least once
        expect(spy).toHaveBeenCalled()
        spy.mockRestore()
    })
})