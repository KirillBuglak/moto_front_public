const InfoFragment = ({name, value, onChange}) => (
    <>
        <label>{name}</label>
        <input
            type='text'
            placeholder={name}
            value={value}
            onChange={onChange} />
    </>
)

export default InfoFragment