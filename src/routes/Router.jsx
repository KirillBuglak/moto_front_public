import { Route, Routes } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'
import { appConfig } from '../config.js'
import './../styles/Router.scss'
import PrivateRoute from './PrivateRoute'
import AbstractTable from '../components/abstract/AbstractTable'
import Profile from '../components/administration/Profile.jsx'
import Settings from '../components/administration/Settings.jsx'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { reducersForRouter } from '../store/store.js'

const Router = () => {
    const { t } = useTranslation()

    const [sendNotif, setSendNotif] = useState(() => {
        return JSON.parse(localStorage.getItem('sendNotif')) ?? false
    })

    useEffect(() => {
        localStorage.setItem('sendNotif', JSON.stringify(sendNotif))
    }, [sendNotif])

    const renderRoutes = (routes, parentPath) =>
        routes.map((route) => {
            const { path, children, accessAuths, title, reducer } = route

            const fullPath = parentPath ? `${parentPath}/${path}` : path

            if (children) {
                return (
                    <Route key={path} path={path}>
                        {renderRoutes(children, fullPath)}
                    </Route>
                )
            } else {
                const element = accessAuths ? (
                    <PrivateRoute roles={accessAuths}>
                        <AbstractTable
                            title={title}
                            reducer={reducersForRouter[reducer]}
                            fullBackPath={fullPath}
                            sendNotif={sendNotif} />
                    </PrivateRoute>
                ) : (
                    <AbstractTable
                        title={title}
                        reducer={reducersForRouter[reducer]}
                        fullBackPath={fullPath}
                        sendNotif={sendNotif} />
                )
                return <Route key={path} path={path} element={element} />
            }
        })

    return (
        <div className='main-layout'>
            <Routes>
                <Route path='/'>
                    <Route index element={<div className='default'>{t('mainPage')}</div>} />
                    <Route path='login' element={<LoginForm />} />
                    <Route path='profile' element={<Profile />} />
                    <Route path='settings' element={
                        <Settings
                            sendNotif={sendNotif}
                            setSendNotif={setSendNotif} />} />
                    {renderRoutes(appConfig)}
                    <Route path="*" element={<div className='default'>{t('notFound')}</div>} />
                </Route>
            </Routes>
        </div>
    )
}

export default Router