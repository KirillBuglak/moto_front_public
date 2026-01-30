import { forwardRef } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from './auth/authSlice'
import './../styles/AccountMenu.scss'
import { useTranslation } from 'react-i18next'

const AccountMenu = forwardRef((props, ref) => {
    const { t } = useTranslation()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await dispatch(logout())
            navigate('/login')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    const goToProfile = () => navigate('profile')
    const goToSettings = () => navigate('settings')

    return (
        <div ref={ref} className='account-menu'>
            <div onClick={goToProfile} className='account-menu-header'>
                {t('profile')}
                <AccountCircleIcon className='account-icon' />
            </div>
            <div className='divider' />
            <div className='account-menu-options'>
                <div onClick={goToSettings}>{t('settings')}</div>
                <div onClick={handleLogout}>{t('logout')}</div>
            </div>
        </div>
    )
})

export default AccountMenu