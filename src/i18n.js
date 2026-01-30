import i18n from 'i18next'
import { initReactI18next } from "react-i18next"
import LanguageDetector from 'i18next-browser-languagedetector'
import eng from './translations/eng.json'
import spa from './translations/spa.json'

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        resources: {
            en: {
                translation: eng
            },
            es: {
                translation: spa
            }
        }
    })

export default i18n