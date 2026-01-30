import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import * as testSlice from '../components/testComponents/testSlice.js'
import authReducer from '../components/auth/authSlice.js'
import * as partsSlice from '../components/parts/partsSlice.js'
import * as adminSlice from '../components/administration/adminSlice.js'

const persistConfig = {
    key: 'auth',
    storage,
}

const persistedAuthReducer = persistReducer(persistConfig, authReducer)

export const reducersForRouter = {
    testRed: testSlice,
    adminRed: adminSlice,
    partsRed: partsSlice
}

let reducers = {
    authRed: persistedAuthReducer
}

for (const key in reducersForRouter) {
    reducers[key] = reducersForRouter[key].default
}

const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
                ignoredActions: ['persist/PERSIST'],
            }
    }),
    devTools: process.env.NODE_ENV !== 'production'
})

export const persistor = persistStore(store)
export default store