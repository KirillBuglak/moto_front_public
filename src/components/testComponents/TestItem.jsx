const TestItem = ({ onRemove, name, position }) => (
    <li><h1>Hello {name}, {position}</h1>
        <span>
            <button type="button" onClick={() => onRemove(name)}>
                Dismiss
            </button>
        </span></li>
)

export default TestItem