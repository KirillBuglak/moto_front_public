function hueColor(hex, percent, opacity) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)

    const adjust = (c) => {
        if (percent < 0) {
            const f = -percent / 100
            return Math.round(c + (255 - c) * f)
        } else {
            const f = percent / 100
            return Math.round(c * (1 - f))
        }
    }

    const clamp = v => Math.max(0, Math.min(255, adjust(v)))
    const toHex = v => clamp(v).toString(16).padStart(2, '0').toUpperCase()

    if (opacity !== undefined && opacity >= 0 && opacity <= 1) {
        return `rgba(${clamp(r)}, ${clamp(g)}, ${clamp(b)}, ${opacity})`
    }
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function setColorsCSSVariables(theme) {
    const { chosenOption } = theme
    const colors = theme[`${chosenOption}-colors`]

    const option = chosenOption === 'light'

    document.documentElement.style.setProperty('--headerFirst-color', colors.headerFirst)
    document.documentElement.style.setProperty('--headerSecond-color', colors.headerSecond)
    document.documentElement.style.setProperty('--primary-color', colors.primary)
    document.documentElement.style.setProperty('--secondary-color', colors.secondary)
    document.documentElement.style.setProperty('--layout-color', colors.layout)
    document.documentElement.style.setProperty('--layout-transparent-color', hueColor(colors.layout, 0, 0.8))
    document.documentElement.style.setProperty('--success-color', colors.success)
    document.documentElement.style.setProperty('--cancel-color', colors.cancel)
    document.documentElement.style.setProperty('--notification-color', colors.notification)
    document.documentElement.style.setProperty('--button-color', colors.button)
    document.documentElement.style.setProperty('--primary-color-hover', hueColor(colors.primary, option ? -50 : 20))
    document.documentElement.style.setProperty('--topMenu-color-hover', hueColor(colors.secondary, option ? 5 : -20))
    document.documentElement.style.setProperty('--subMenu-color-hover', hueColor(colors.secondary, option ? 10 : -40))
    document.documentElement.style.setProperty('--rowHighlighted-color-hover', hueColor(colors.secondary, option ? 20 : -50))
}

export const formatHeader = (key) => {
    const formatted = key.replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([a-z])([A-Z][a-z])/g, '$1 $2')
        .toUpperCase()
        .replace(/_/g, ' ')
    return formatted
}

export const addCreatedItemToState = (state, path, createdItem) => {
    if (!state.data[path]) {
        state.data[path] = []
    }

    state.data[path].push(createdItem)
}

export const updateItemInState = (state, path, updatedItem) => {
    console.log(updatedItem)
    if (state.data[path]) {
        const index = state.data[path].findIndex(item => item.id === updatedItem.id)
        if (index !== -1) {
            state.data[path][index] = updatedItem
        } else {
            console.warn(`Item with id ${updatedItem.id} not found in ${path}`)
        }
    }
}

export const removeItemFromState = (state, valueName, id) => {
    if (state.data[valueName]) {
        state.data[valueName] = state.data[valueName].filter(item => item.id != id)
        if (state.data[valueName].length === 0) {
            delete state.data[valueName]
        }
    }
} 

export const getPathArray = (path) => path.split('/')

export const arraysEqualById = (a, b) => {
  if (!Array.isArray(a) || !Array.isArray(b)) return false
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i].id !== b[i].id) return false
  }
  return true
}