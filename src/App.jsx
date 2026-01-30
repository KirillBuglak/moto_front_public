import './App.scss'
import { setColorsCSSVariables } from './utils/Utils'
import { useEffect, useState } from 'react'
import LeftMenu from './components/LeftMenu'
import UpperBar from './components/UpperBar'
import Router from './routes/Router'
import { useSelector } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import LoginForm from './components/auth/LoginForm'
import { defaultTheme } from './config'
// import { ThemeProvider } from './components/ThemeContext'

const App = () => {
    const [openLeftMenu, setOpenLeftMenu] = useState(() => {
        const storedValue = localStorage.getItem('menuOpen')
        return JSON.parse(storedValue) ?? true
    })

    useEffect(() => {
        try {
            const stored = localStorage.getItem('theme')
            const themeObj = stored ? JSON.parse(stored) : defaultTheme

            if (!stored) localStorage.setItem('theme', JSON.stringify(themeObj))
            setColorsCSSVariables(themeObj)
        } catch (error) {
            console.error('Error getting theme from localStorage', error)

            localStorage.setItem('theme', JSON.stringify(defaultTheme))
            setColorsCSSVariables(defaultTheme)
        }
    })

    useEffect(() => {
        localStorage.setItem('menuOpen', openLeftMenu)
    }, [openLeftMenu])

    const toggleLeftMenu = () => {
        setOpenLeftMenu(!openLeftMenu)
    }

    const authorities = useSelector(state => state.authRed.data.authorities)

    return (
        <BrowserRouter>
            {/* <ThemeProvider theme={theme}> */}
            <div className='layout'>
                {authorities
                    ? <>
                        <UpperBar openLeftMenu={openLeftMenu} toggle={toggleLeftMenu} />
                        <div className={`content-wrapper ${openLeftMenu ? 'menu-open' : 'menu-closed'}`}>
                            <LeftMenu open={openLeftMenu} />
                            <Router />
                        </div>
                    </>
                    : <LoginForm />
                }
            </div>
            {/* </ThemeProvider> */}
        </BrowserRouter >
    )
}

export default App