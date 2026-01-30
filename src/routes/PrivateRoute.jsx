import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"
import './../styles/PrivateRoute.scss'
import { useTranslation } from "react-i18next"


const PrivateRoute = ({ roles, children }) => {
    const { t } = useTranslation()
    
    let location = useLocation()
    const loading = useSelector((state) => state.authRed.loading)
    const authorities = useSelector((state) => state.authRed.data.authorities)

    if (loading) {
        return <p>{t('checkingAuth')}</p>
    }
    
    if (authorities === null) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    const hasRequiredRole =
        Array.isArray(authorities) &&
        Array.isArray(roles) &&
        authorities.some(authority => roles.includes(authority))
        
    if (!hasRequiredRole) {
        return <p className="denied">{t('accessDenied')}</p>
    }

    return children
}

export default PrivateRoute