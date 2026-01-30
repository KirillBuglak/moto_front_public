import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import TestList from './TestList'
import axios from 'axios'
import TestSearchForm from './TestSearchForm'

const API_ENDPOINT = 'https://localhost:8443/front_test/'

const stateReducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_INIT': return {
            ...state,
            isLoading: true,
            isError: false
        }
        case 'FETCH_SUCCESS': return {
            ...state,
            isLoading: false,
            isError: false,
            data: action.payload
        }
        case 'FETCH_FAILURE': return {
            ...state,
            isLoading: false,
            isError: true
        }
        case 'REMOVE_ITEM': return {
            ...state,
            data: state.data.filter((rec) => rec.name !== action.payload)
        }
        default: throw new Error()
    }
}

const TestContainer = () => {
    
    const [complexState, dispatchComplexState] = useReducer(
        stateReducer,
        { data: [], isLoading: false, isError: false }
    )

    const handleRemoveItem = useCallback((name) => { //useCallback forces to create this function only once
        dispatchComplexState({
            type: 'REMOVE_ITEM',
            payload: name
        })
    }, [])


    const useStorageState = (key, initState) => {

        const isMounted = useRef(false)

        const [value, setValue] = useState(
            localStorage.getItem(key) || initState)

        useEffect(() => {
            if (!isMounted.current) {
                isMounted.current = true
            } else {
                localStorage.setItem(key, value)
            }
        }, [value, key])

        return [value, setValue]
    }

    const [searchState, setSearchState] = useStorageState('search', 'O')

    const [url, setUrl] = useState(
        `${API_ENDPOINT}${searchState}`
    )

    const callBackHandler = (event) => {
        console.log('handled back to App')
    }

    const handleSearchInput = (event) => {
        setSearchState(event.target.value)
        console.log(searchState)
    }

    const handleSearchSubmit = (event) => {
        setUrl(`${API_ENDPOINT}${searchState}`)

        event.preventDefault()
    }

    const handleFetchList = useCallback(async () => {
        if (!searchState) return

        dispatchComplexState({ type: 'FETCH_INIT' })

        try {
            const result = await axios.get(url)

            dispatchComplexState({
                type: 'FETCH_SUCCESS',
                payload: result.data
            })
        } catch (error) {
            console.error('Fetch error:', error)
            dispatchComplexState({ type: 'FETCH_FAILURE' })
        }
    }, [url])

    useEffect(() => {
        handleFetchList()
    }, [handleFetchList]
    )


    return (
        <div className='TestContainer'>
            <TestSearchForm
                onInpChange={handleSearchInput}
                onSubmit={handleSearchSubmit}
                value={searchState}
            />
            {complexState.isError && <p>Something went wrong ...</p>}
            {complexState.isLoading ? (
                <p>Loading ...</p>
            ) : (
                <TestList
                    list={complexState.data}
                    handBack={callBackHandler}
                    onRemove={handleRemoveItem} />
            )}

        </div>
    )
}

export default TestContainer

export {TestList, TestSearchForm, stateReducer}