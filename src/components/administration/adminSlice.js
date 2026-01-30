import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getLoggedUserDetails, updateLoggedUserDetails } from '../../api/api'
import { addCommonExtraReducers, addThunkCases, createCommonThunks } from '../../utils/SliceUtils'

const commonThunks = createCommonThunks('admin')
export const { getRecords, createRecord, updateRecord, deleteRecord } = commonThunks

export const getDetails = createAsyncThunk(
    'admin/getDetails',
    async ({ userName }, thunkApi) => {
        return await getLoggedUserDetails({ userName }, thunkApi)
    }
)

export const updateDetails = createAsyncThunk(
    'admin/updateDetails',
    async ({ updatedUserDetails }, thunkApi) => {
        return await updateLoggedUserDetails({ updatedUserDetails }, thunkApi)
    }
)

export const updateProfileDetails = createAction('admin/updateProfileDetails')

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        data: {
            profileDetails: {
                id: null,
                username: "",
                firstName: "",
                lastName: "",
                birthday: "",
                phone: "",
                email: ""
            }
        },
        loading: false,
        error: null
    },
    reducers: {
        updateProfileDetails: (state, action) => {
            state.data.profileDetails = {
                ...state.data.profileDetails,
                [action.payload.field]: action.payload.value
            }
        }
    },
    extraReducers: (builder) => {
            addThunkCases(builder, getDetails, (state, action) => {
                state.loading = false
                state.data.profileDetails = action.payload
                state.error = false
            })

            addThunkCases(builder, updateDetails, (state) => {
                state.loading = false
                state.error = false
            })

            addCommonExtraReducers(builder, commonThunks)
    }
})

export default adminSlice.reducer

export const sliceName = adminSlice.name + 'Red'
