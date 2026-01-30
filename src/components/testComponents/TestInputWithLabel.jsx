const TestInputWithLabel = ({ id, onInpChange, value, isFocused, children }) => {

    return (
        <> 
            <label htmlFor={id}>{children}: </label>
            <input autoFocus={isFocused} id={id} type="text" onChange={onInpChange} value={value} />
        </>
    )
}

export default TestInputWithLabel