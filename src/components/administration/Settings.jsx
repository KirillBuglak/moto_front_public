import { useEffect, useState } from 'react'
import { setColorsCSSVariables } from '../../utils/Utils'
import '../../styles/Settings.scss'
import { useTranslation } from 'react-i18next'
import AlertMessage from '../AlertMessage'
import { defaultTheme } from '../../config'

const Settings = ({ sendNotif, setSendNotif }) => {
    const { t } = useTranslation()

    const [showAlert, setShowAlert] = useState(false)
    const isChecked = sendNotif

    const [theme, setTheme] = useState(() => {
        const storedValue = localStorage.getItem('theme')
        return JSON.parse(storedValue)
    })

    useEffect(() => {
        localStorage.setItem('theme', JSON.stringify(theme))
        setColorsCSSVariables(theme)
    }, [theme])

    useEffect(() => {
        localStorage.setItem('sendNotif', isChecked)
    }, [isChecked])

    const handleAlertToggle = (event) => {
        const checked = event.target.checked
        setSendNotif(checked)
        if (checked) {
            setShowAlert(true)
            setTimeout(() => {
                setShowAlert(false)
            }, 3000)
        }
    }

    const handleChosenThemeChange = (event) => {
        const selectedTheme = event.target.value
        const updatedTheme = {
            ...theme,
            chosenOption: selectedTheme
        }
        setTheme(updatedTheme)
    }

    const handleColorChange = (event) => {
        const colorType = event.target.id
        const newColor = event.target.value
        const currentTheme = theme.chosenOption

        const updatedColors = {
            ...theme[`${currentTheme}-colors`],
            [colorType]: newColor
        }

        const updatedTheme = {
            ...theme,
            [currentTheme + '-colors']: updatedColors
        }

        setTheme(updatedTheme)
    }

    const handleReset = () => {
        const currentOption = theme.chosenOption
        setTheme({
            ...defaultTheme,
            chosenOption: currentOption
        })
    }

    return (
        <div className='settings-layout'>
            {showAlert && (
                <AlertMessage message={t('notifUpdated')} />
            )}
            <p className='header'>{t('settings')}</p>
            <div className='settings'>
                <div className='settings-theme'>
                    <h3>{t('themeSettings')}</h3>
                    <label>{t('themeVariation')}</label>
                    <div className='theme-options'>
                        <div className='theme-option'>
                            <input
                                type="radio"
                                id="light-theme"
                                name="theme"
                                value="light"
                                checked={theme.chosenOption === 'light'}
                                onChange={handleChosenThemeChange}
                            />
                            <label htmlFor="light-theme">{t('light')}</label>
                        </div>
                        <div className='theme-option'>
                            <input
                                type="radio"
                                id="dark-theme"
                                name="theme"
                                value="dark"
                                checked={theme.chosenOption === 'dark'}
                                onChange={handleChosenThemeChange}
                            />
                            <label htmlFor="dark-theme">{t('dark')}</label>
                        </div>
                    </div>
                    <label>{t('colors')}</label>
                    <div className='colors'>
                        <div className='colors-left'>
                            <div>
                                <input
                                    type='color'
                                    id='headerFirst'
                                    value={theme[theme.chosenOption + '-colors'].headerFirst}
                                    onChange={handleColorChange}
                                />
                                <label htmlFor="headerFirst">{t('header')} {t('first')}</label>
                            </div>
                            <div>
                                <input
                                    type='color'
                                    id='headerSecond'
                                    value={theme[theme.chosenOption + '-colors'].headerSecond}
                                    onChange={handleColorChange}
                                />
                                <label htmlFor="headerSecond">{t('header')} {t('second')}</label>
                            </div>
                            <div>
                                <input
                                    type='color'
                                    id='primary'
                                    value={theme[theme.chosenOption + '-colors'].primary}
                                    onChange={handleColorChange}
                                />
                                <label htmlFor="primary">{t('primary')}</label>
                            </div>
                            <div>
                                <input
                                    type='color'
                                    id='secondary'
                                    value={theme[theme.chosenOption + '-colors'].secondary}
                                    onChange={handleColorChange}
                                />
                                <label htmlFor="secondary">{t('secondary')}</label>
                            </div>
                            <div>
                                <input
                                    type='color'
                                    id='layout'
                                    value={theme[theme.chosenOption + '-colors'].layout}
                                    onChange={handleColorChange}
                                />
                                <label htmlFor="layout">{t('layout')}</label>
                            </div>
                        </div>
                        <div className='colors-right'>
                            <div>
                                <input
                                    type='color'
                                    id='success'
                                    value={theme[theme.chosenOption + '-colors'].success}
                                    onChange={handleColorChange}
                                />
                                <label htmlFor="success">{t('success')}</label>
                            </div>
                            <div>
                                <input
                                    type='color'
                                    id='cancel'
                                    value={theme[theme.chosenOption + '-colors'].cancel}
                                    onChange={handleColorChange}
                                />
                                <label htmlFor="cancel">{t('cancel')}</label>
                            </div>
                            <div>
                                <input
                                    type='color'
                                    id='notification'
                                    value={theme[theme.chosenOption + '-colors'].notification}
                                    onChange={handleColorChange}
                                />
                                <label htmlFor="notification">{t('notification')}</label>
                            </div>
                            <div>
                                <input
                                    type='color'
                                    id='button'
                                    value={theme[theme.chosenOption + '-colors'].button}
                                    onChange={handleColorChange}
                                />
                                <label htmlFor="button">{t('button')}</label>
                            </div>
                        </div>
                    </div>
                    <div className='confirm-buttons'>
                        <button className='reset'
                            onClick={handleReset}>{t('reset')}</button>
                    </div>
                </div>
                <div className='settings-other'>
                    <h3>{t('otherSettings')}</h3>
                    <label>{t('notification_plural')}</label>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleAlertToggle}
                        />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
        </div>
    )
}

export default Settings