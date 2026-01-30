import TestItem from "./TestItem.jsx"
import '../../App.scss'
import { memo, useMemo, useState } from "react"
import { sortBy } from 'lodash'


const TestList = memo(({ list, handBack, onRemove }) => {

    const [isSorted, setIsSorted] = useState(false)

    const sortedList = useMemo(() => {
        if (isSorted) {
            return sortBy(list, 'name')
        }
        return list
    }, [list, isSorted])

    const handleButton = (event) => {
        handBack(event)
    }

    return (
        <ul className='test_list'>
            {isSorted ? (
                <button onClick={() => setIsSorted(false)}>
                    Sorted by name
                </button>
            ) : (
                <button onClick={() => setIsSorted(true)}>
                    Click to Sort
                </button>
            )}

            {sortedList.map(({ id, ...item }) => ( //... - is a rest operator here
                <TestItem onRemove={onRemove} key={id}{...item} /> //... - is a spread operator
            ))}
            <button style={{ width: '40%' }} onClick={handleButton}>
                Click
            </button>
        </ul>
    )
})

export default TestList