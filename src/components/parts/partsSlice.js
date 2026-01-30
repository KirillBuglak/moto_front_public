import { createSlice } from '@reduxjs/toolkit'
import { addCommonExtraReducers, createCommonThunks } from '../../utils/SliceUtils'

const commonThunks = createCommonThunks('parts')
export const { getRecords, createRecord, updateRecord, deleteRecord } = commonThunks

const partsSlice = createSlice({
    name: 'parts',
    initialState: {
        data: {
            notification: null
        },
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        addCommonExtraReducers(builder, commonThunks)
    }
})

export const selectValue = (state, valueName) => {
    return state.partsRed[valueName]
}

export default partsSlice.reducer

export const sliceName = partsSlice.name + 'Red'