import '../../styles/Profile.scss'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CloseIcon from '@mui/icons-material/Close'
import ContactPageIcon from '@mui/icons-material/ContactPage'
import KeyIcon from '@mui/icons-material/Key'
import ContactsIcon from '@mui/icons-material/Contacts'
import LockResetIcon from '@mui/icons-material/LockReset'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import LockIcon from '@mui/icons-material/Lock'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { getDetails, updateDetails, updateProfileDetails } from './adminSlice'
import InfoFragment from './InfoFragment'


const Profile = () => {
    const { t } = useTranslation()

    const dispatch = useDispatch()

    const userNameExample = useSelector(state => state.authRed.data.login)
    const profileDetails = useSelector(state => state.adminRed.data.profileDetails)

    const [updatePasswordOpened, setUpdatePasswordOpened] = useState(false)
    const [currentStatusStep, setCurrentStatusStep] = useState(3)

    const toggleOpenUpdatePassword = () => {
        setUpdatePasswordOpened(!updatePasswordOpened)
    }

    const handleCurrentStatusStepChange = () => {
        setCurrentStatusStep(4)
        toggleOpenUpdatePassword()
    }

    const profileSteps = [
        { icon: <ContactPageIcon />, text: t('personalInfoFilled') },
        { icon: <ContactsIcon />, text: t('contactInfoFilled') },
        { icon: <AccountCircleIcon />, text: t('avatarUploaded') },
        { icon: <KeyIcon />, text: t('passwordUpdated') }
    ]

    useEffect(() => {
        console.log('rendered')
        dispatch(getDetails({ userName: userNameExample }))
    }, [])

    const handleCancel = () => {
        dispatch(getDetails({ userName: userNameExample }))
    }

    const handleSave = () => {
        dispatch(updateDetails({ updatedUserDetails: profileDetails }))
    }

    const handleChange = (field) => (e) => {
        const value = e.target.value
        dispatch(updateProfileDetails({ field, value }))
    }

    return (
        <div className='profile-layout'>
            <p className='header'>{t('profile')}</p>
            <div className='profile'>
                <div className='profile-left'>
                    <button className='close-button'>
                        <CloseIcon />
                    </button>
                    <div className='photo-layout'>
                        <AccountCircleIcon className='avatar' />
                    </div>
                    <button className='photo-upload-button'>
                        <p>{t('upload')}</p>
                    </button>
                </div>
                <div className='profile-center'>
                    <h3>{t('personalInfo')}</h3>
                    <InfoFragment
                        name={t('name')}
                        value={profileDetails.firstName}
                        onChange={handleChange('firstName')}
                    />
                    <InfoFragment
                        name={t('surname')}
                        value={profileDetails.lastName}
                        onChange={handleChange('lastName')}
                    />
                    <InfoFragment
                        name={t('birthDate')}
                        value={profileDetails.birthday}
                        onChange={handleChange('birthday')}
                    />
                    <h3>{t('contactInfo')}</h3>
                    <InfoFragment
                        name={t('email')}
                        value={profileDetails.email}
                        onChange={handleChange('email')}
                    />
                    <InfoFragment
                        name={t('phone')}
                        value={profileDetails.phone}
                        onChange={handleChange('phone')}
                    />
                    <div className='confirm-buttons'>
                        <button className='save' onClick={handleSave}>{t('save')}</button>
                        <button className='cancel' onClick={handleCancel}>{t('cancel')}</button>
                    </div>
                </div>
                <div className='profile-right'>
                    <h3>{t('profileStatus')}</h3>
                    <div className='current-status'>
                        {profileSteps.map((step, index) => (
                            <div key={index} className={currentStatusStep > index ? 'complete' : undefined}>
                                {step.icon}
                                <p>{step.text}</p>
                            </div>
                        ))}
                    </div>
                    <h3>{t('passwordManagement')}</h3>
                    <div className='password-management'>
                        <button className='update-button' onClick={toggleOpenUpdatePassword}>
                            <p>{t('updatePassword')}</p>
                            <LockResetIcon />
                        </button>
                        {updatePasswordOpened && <div className='update-password-form' >
                            <div>
                                <LockOpenIcon />
                                <input type='password' placeholder={t('enterCurrentPassword')} required />
                            </div>
                            <div className='divider' />
                            <div>
                                <LockIcon />
                                <input type='password' placeholder={t('enterNewPassword')} required />
                            </div>
                            <div>
                                <LockIcon />
                                <input type='password' placeholder={t('confirmNewPassword')} required />
                            </div>
                            <button onClick={handleCurrentStatusStepChange}>{t('update')}</button>
                        </div>}
                    </div>
                </div>
            </ div>
        </div>
    )
}

export default Profile