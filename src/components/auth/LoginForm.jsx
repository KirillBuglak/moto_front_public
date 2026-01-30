import { useEffect, useState } from 'react'
import PersonIcon from '@mui/icons-material/Person'
import KeyIcon from '@mui/icons-material/Key'
import { useDispatch, useSelector } from 'react-redux'
import { login } from './authSlice.js'
import { useNavigate, useLocation } from 'react-router-dom'
import '../../styles/LoginForm.scss'
import { useTranslation } from 'react-i18next'

const LoginForm = () => {
    const { t } = useTranslation()

    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    const authorities = useSelector(state => state.authRed.data.authorities)
    const navigate = useNavigate()
    const location = useLocation()

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(login({ userName, password }))
    }

    useEffect(() => {
        if (authorities && Array.isArray(authorities)) {
            const redirectPath = location.state?.from?.pathname || '/'
            navigate(redirectPath, { replace: true })
        }
    }, [authorities, navigate, location])

    return (
        <div className='login-form-wrapper'>
            <form className='login-form-layout' onSubmit={handleSubmit}>
                <h1>{t('login')}</h1>
                <div>
                    <PersonIcon />
                    <input type='text' placeholder={t('username')} value={userName} onChange={(e) => setUserName(e.target.value)} required />
                </div>
                <div>
                    <KeyIcon />
                    <input type='password' placeholder={t('password')} value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type='submit'>{t('signIn')}</button>
            </form>
        </div>
    )
}

export default LoginForm