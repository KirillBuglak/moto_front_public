import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const testSlice = createSlice(
    {
        name: 'testCounter',
        initialState: {
            someValue: 0
        },
        reducers: {
            increment: state => {
                state.someValue += 1
            },
            decrement: state => {
                state.someValue -= 1
            },
            incrementByAmount: (state, action) => {
                state.someValue += action.payload
            }
        },
        extraReducers: (builder) => {
            builder.addCase(incrementAsync.fulfilled, (state, action) => {
                state.someValue += action.payload
            })
        }
    }
)

export const incrementAsync = createAsyncThunk(
    'testCounter/asyncIncr',
    async (amount) => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return amount
    }
)

export const { increment, decrement, incrementByAmount } = testSlice.actions
export default testSlice.reducer

export const selectCount = (state) => state.testRed.someValue
