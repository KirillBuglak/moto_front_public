import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { appConfig } from '../config'
import './../styles/LeftMenu.scss'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const LeftMenu = ({ open }) => {
    const { t } = useTranslation()

    const navigate = useNavigate()

    const [openPaths, setOpenPaths] = useState([])

    const isOpen = (path) => {
        return openPaths.some(openPath =>
            openPath.length === path.length &&
            openPath.every((v, i) => v === path[i])
        )
    }

    const handleClick = (path, item, fullPath) => {
        if (!item.children || item.children.length === 0) {

            navigate(fullPath)
            return
        }
        // Has children - toggle open/close
        if (isOpen(path)) {
            // Closing: Remove this path and all its descendants
            setOpenPaths(openPaths =>
                openPaths.filter(openPath =>
                    !(
                        openPath.length >= path.length &&
                        openPath.every((v, i) => v === path[i])
                    )
                )
            )
        } else {
            setOpenPaths(openPaths => [...openPaths, path])
        }
    }

    const buildFullPath = (pathSegments) => {
        // Remove empty segments, join with '/'
        return '/' + pathSegments.filter(Boolean).join('/')
    }

    const renderMenu = (items, path = [], parentPaths = []) => (
        <div>
            {items.map((item, idx) => {
                // Compose the path for this menu item
                const currentPath = [...path, idx]
                // Compose the URL path for navigation
                const itemPath = item.path || ''

                const newParentPaths = [...parentPaths]
                if (itemPath && itemPath !== '/') {
                    newParentPaths.push(itemPath)
                }

                const hasChildren = Array.isArray(item.children) && item.children.length > 0
                return (
                    item.icon && <div key={(item.title || item.path || '') + idx}>
                        <div
                            className={`top-menu-item${path.length > 0 ? ' sub-menu-1' : ''}`}
                            onClick={() => handleClick(currentPath, item, buildFullPath(newParentPaths))}
                        >
                            {item.icon}
                            <p>{t(item.title)}</p>
                            {hasChildren && (
                                <span>
                                    {isOpen(currentPath) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </span>
                            )}
                        </div>
                        {hasChildren && isOpen(currentPath) && (
                            <div>
                                {renderMenu(item.children, currentPath, newParentPaths)}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )

    // appConfig is an array, start with its first (root) element's children
    const menuItems = Array.isArray(appConfig) && appConfig.length > 0 && appConfig[0].children
        ? appConfig[0].children
        : []

    return (
        <aside className={`left-menu ${open ? 'open' : 'closed'}`}>
            <div className='top-menu'>
                {renderMenu(menuItems)}
            </div>
        </aside>
    )
}

export default LeftMenu