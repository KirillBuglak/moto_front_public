import { formatHeader } from "../../utils/Utils"

const CreateUpdateForm = ({
    dataToSave,
    setDataToSave,
    headers,
    updateClicked,
    onSubmit,
    onCancel,
    formRef,
    t
}) => {
    return (
        <form
            ref={formRef}
            className='create-update-window'
            onSubmit={onSubmit}>
            <div className='input-rows'>
                {headers.map((header, index) => (
                    header !== 'id' &&
                    <div className='input-row' key={index}>
                        <label htmlFor={`input-${header}`}>{(formatHeader(t(header)))}</label>
                        <input
                            id={`input-${header}`}
                            name={header}
                            type='text'
                            value={dataToSave[header]}
                            onChange={(e) => {
                                setDataToSave({
                                    ...dataToSave,
                                    [header]: e.target.value
                                })
                            }}
                            placeholder={(formatHeader(t(header)))} />
                    </div>
                ))}
            </div>
            <div className='confirm-buttons'>
                <button className='save' type='submit'>
                    {updateClicked ? t('update') : t('save')}
                </button>
                <button className='cancel' type='button'
                    onClick={onCancel}>
                    {t('cancel')}
                </button>
            </div>
        </form>
    )
}

export default CreateUpdateForm
