import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import store from '../store/store'

// Custom render function to wrap components with necessary providers
export const renderWithProviders = (component) => {
    return render(
        <Provider store={store}>
            <I18nextProvider i18n={i18n}>
                <BrowserRouter>
                    {component}
                </BrowserRouter>
            </I18nextProvider>
        </Provider>
    )
}