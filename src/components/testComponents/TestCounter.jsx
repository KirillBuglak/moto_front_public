import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement, incrementByAmount, selectCount, incrementAsync } from './testSlice.js'

const TestCounter = () => {

    const count = useSelector(selectCount)

    const dispatch = useDispatch()

    return (
        <div>
            <h1>Redux Counter</h1>
            <p>Count: {count}</p>
            <button onClick={() => dispatch(increment())}>Increment</button>
            <button onClick={() => dispatch(decrement())}>Decrement</button>
            <button onClick={() => dispatch(incrementByAmount(5))}>Increment by 5</button>
            <button onClick={() => dispatch(incrementAsync(3))}>Increment Async</button>
        </div>
    )
}

export default TestCounter