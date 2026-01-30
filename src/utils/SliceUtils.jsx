import { createAsyncThunk } from "@reduxjs/toolkit"
import { createRecordCall, deleteRecordCall, getRecordsCall, updateRecordCall } from "../api/api"
import { addCreatedItemToState, arraysEqualById, getPathArray, removeItemFromState, updateItemInState } from "./Utils"

export const createCommonThunks = (sliceName) => ({
    getRecords: createAsyncThunk(
        `${sliceName}/getRecords`,
        async (path, thunkApi) => {
            const result = await getRecordsCall({ path }, thunkApi)
            return { result, path }
        }
    ),
    createRecord: createAsyncThunk(
        `${sliceName}/createRecord`,
        async ({ path, body }, thunkApi) => {
            const result = await createRecordCall({ path, body }, thunkApi)
            return { result, path }
        }
    ),
    updateRecord: createAsyncThunk(
        `${sliceName}/updateRecord`,
        async ({ path, body }, thunkApi) => {
            const result = await updateRecordCall({ path, body }, thunkApi)
            return { result, path }
        }
    ),
    deleteRecord: createAsyncThunk(
        `${sliceName}/deleteRecord`,
        async (path, thunkApi) => {
            await deleteRecordCall({ path }, thunkApi)
            return { path }
        }
    )
})

export const addCommonExtraReducers = (builder, thunks) => {
    addThunkCases(builder, thunks.getRecords, (state, action) => {
        const { result, path } = action.payload
        const pathArray = getPathArray(path)
        const length = pathArray.length
        const current = state.data[pathArray[length - 1]]
        if (!arraysEqualById(current, result)) {
            console.log('arrays are not equal')
            state.data[pathArray[length - 1]] = result
        }        
        defaultSuccessStateReset(state)
    })
    addThunkCases(builder, thunks.createRecord, (state, action) => {
        const { result, path } = action.payload
        const pathArray = getPathArray(path)
        const length = pathArray.length

        addCreatedItemToState(state, pathArray[length - 1], result)

        state.data.notification = {
            template: "createRecord",
            parameters: [result.id]
        }

        defaultSuccessStateReset(state)
    })
    addThunkCases(builder, thunks.updateRecord, (state, action) => {
        const { result, path } = action.payload
        const pathArray = getPathArray(path)
        const length = pathArray.length

        updateItemInState(state, pathArray[length - 1], result)

        state.data.notification = {
            template: "updateRecord",
            parameters: [result.id]
        }

        defaultSuccessStateReset(state)
    })
    addThunkCases(builder, thunks.deleteRecord, (state, action) => {
        const pathArray = getPathArray(action.payload.path)
        const length = pathArray.length
        const id = pathArray[length - 1]

        removeItemFromState(state, pathArray[length - 2], id)

        state.data.notification = {
            template: "deleteRecords",
            parameters: null
        }

        defaultSuccessStateReset(state)
    })
}

const defaultSuccessStateReset = (state) => {
    state.loading = false
    state.error = false
}

const defaultPendingCase = (state) => {
    state.loading = true
    state.error = null
}

const defaultRejectCase = (state, action) => {
    state.loading = false
    state.error = action.payload.result
}

const addCommonThunkCases = (builder, thunk) => {
    builder
        .addCase(thunk.pending, (state) => {
            defaultPendingCase(state)
        })
        .addCase(thunk.rejected, (state, action) => {
            defaultRejectCase(state, action)
        })
}

export const addThunkCases = (builder, thunk, fulfilledHandler) => {
    addCommonThunkCases(builder, thunk)
    builder.addCase(thunk.fulfilled, fulfilledHandler)
}
