import { useRef, useEffect, useState } from 'react'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import './../styles/UpperBar.scss'
import AccountMenu from './AccountMenu'
import { useTranslation } from 'react-i18next'
import { ES } from 'country-flag-icons/react/3x2'
import { GB } from 'country-flag-icons/react/3x2'

const UpperBar = ({ openLeftMenu, toggle }) => {
    const { t, i18n } = useTranslation()

    const [openAccountMenu, setOpenAccountMenu] = useState(false)
    const menuRef = useRef(null)

    const [lang, setLang] = useState(() => localStorage.getItem('i18nextLng') ?? 'en')

    useEffect(() => {
        i18n.changeLanguage(lang)
    }, [lang])

    const toggleAccountMenu = () => {
        setOpenAccountMenu(!openAccountMenu)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenAccountMenu(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleLangChange = () => setLang(l => l === 'en' ? 'es' : 'en')

    return (
        <>
            <header className='upperBar'>
                <button
                    onClick={toggle}>
                    {openLeftMenu ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </button>
                <h1>
                    {t('headerTitle')}
                </h1>
                <div className='right-buttons-wrapper'>
                    <div className='lang-wrapper'>
                        {lang === 'en' ? <GB /> : <ES />}
                        <button className='lang' onClick={handleLangChange}>{lang.toUpperCase()}</button>
                    </div>
                    <button onClick={toggleAccountMenu} className='login-button'>
                        <AccountCircleIcon className='account-icon' />
                    </button>
                    {openAccountMenu && <AccountMenu ref={menuRef} />}
                </div>
            </header>
        </>
    )
}

export default UpperBar