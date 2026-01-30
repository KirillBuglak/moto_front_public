import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginCall, logoutCall } from '../../api/api'

export const login = createAsyncThunk(
    'auth/login',
    async ({ userName, password }, thunkApi) => {
        const result = await loginCall({ userName, password }, thunkApi)
        return { result, userName }
    }
)

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, thunkApi) => {
        return await logoutCall(thunkApi)
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        data: {
            authorities: null,
            login: null
        },
        loading: false,
        error: null
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(login.fulfilled, (state, action) => {
                const { result, userName } = action.payload
                state.loading = false
                state.data.authorities = result
                state.data.login = userName
                state.error = false
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            .addCase(logout.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false
                state.data.authorities = null
                state.error = null
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export default authSlice.reducer
