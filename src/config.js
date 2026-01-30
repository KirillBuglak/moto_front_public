import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import LocalPoliceIcon from '@mui/icons-material/LocalPolice'
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip'
import PersonIcon from '@mui/icons-material/Person'
import GridViewIcon from '@mui/icons-material/GridView'
import CircleIcon from '@mui/icons-material/Circle'

export const appConfig = [
    {
        path: '',
        children: [
            {
                path: 'admin',
                title: 'Administration',
                icon: <AdminPanelSettingsIcon />,
                children: [
                    {
                        path: 'authorities',
                        accessAuths: ['ROLE_ADMIN'],
                        title: 'Authorities',
                        icon: <LocalPoliceIcon />,
                        reducer: 'adminRed'
                    },
                    {
                        path: 'roles',
                        accessAuths: ['ROLE_ADMINs'], //Intentional spell error to show an alert message
                        title: 'Roles',
                        icon: <PrivacyTipIcon />,
                        reducer: 'adminRed'
                    },
                    {
                        path: 'users',
                        accessAuths: ['ROLE_ADMIN'],
                        title: 'Users',
                        icon: <PersonIcon />,
                        reducer: 'adminRed'
                    }
                ]
            },
            {
                path: 'parts',
                title: 'Parts',
                icon: <GridViewIcon />,
                children: [
                    {
                        path: 'brakes',
                        title: 'Brakes',
                        icon: <CircleIcon />,
                        reducer: 'partsRed'
                    },
                    {
                        path: 'chassis',
                        title: 'Chassis',
                        icon: <CircleIcon />,
                        reducer: 'partsRed'
                    },
                    {
                        path: 'engine',
                        title: 'Engine',
                        icon: <CircleIcon />,
                        reducer: 'partsRed'
                    }
                ]
            }
        ]
    }
]

export const defaultTheme = {
    chosenOption: 'light',
    'light-colors': {
        headerFirst: '#d1f7ff',
        headerSecond: '#9dcdf5',
        primary: '#000000',
        secondary: '#fafafa',
        layout: '#e6e6e6',
        success: '#02bb83',
        cancel: '#ffd6d6',
        notification: '#93eafb',
        button: '#c7e9ff'
    },
    'dark-colors': {
        headerFirst: '#006a80',
        headerSecond: '#003866',
        primary: '#ffffff',
        secondary: '#363636',
        layout: '#1a1a1a',
        success: '#8affab',
        cancel: '#db0000',
        notification: '#008fa8',
        button: '#1c829c'
    }
}