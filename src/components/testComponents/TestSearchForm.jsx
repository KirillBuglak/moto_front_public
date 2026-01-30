import TestInputWithLabel from './TestInputWithLabel'
import TestString from './TestString'

const TestSearchForm = ({
    onInpChange,
    onSubmit,
    value
}) => (
    <form onSubmit={onSubmit}>
        <TestInputWithLabel
                id='search'
                label='Search'
                onInpChange={onInpChange}
                value={value}
                onSubmit={onSubmit}
                isFocused>
                <TestString str='Search' />{/* Here we pass the component */}
            </TestInputWithLabel>
        <button type="submit" disabled={!value}>
            Submit
        </button>
    </form>
)

export default TestSearchForm