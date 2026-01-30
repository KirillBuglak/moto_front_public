import { useEffect, useState, useRef, useMemo } from 'react'
import CreateUpdateForm from './CreateUpdateForm'
import Pagination from './Pagination'
import '../../styles/AbstractTable.scss'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { formatHeader, getPathArray } from '../../utils/Utils'
import AlertMessage from '../AlertMessage'

const AbstractTable = ({ title, reducer, fullBackPath, sendNotif }) => {
    const pathArray = useMemo(() => getPathArray(fullBackPath), [fullBackPath])
    const length = pathArray.length
    const currentPath = useMemo(() => pathArray[length - 1], [pathArray, length])

    const { t } = useTranslation()

    const [showAlert, setShowAlert] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(reducer.getRecords(fullBackPath))
    }, [dispatch, currentPath])

    const [showCreateUpdateWindow, setShowCreateUpdateWindow] = useState(false)
    const [updateClicked, setUpdateClicked] = useState(false)

    const stateData = useSelector((state) => state[reducer.sliceName].data[currentPath])
    const loading = useSelector((state) => state[reducer.sliceName].loading)
    const notification = useSelector((state) => state[reducer.sliceName].data.notification)

    const [sortConfig, setSortConfig] = useState(null)
    const [dataToSave, setDataToSave] = useState({})
    const [selectedRows, setSelectedRows] = useState(new Set())
    const rowRefs = useRef({})
    const windowRef = useRef(null)

    useEffect(() => {
        if (sendNotif && notification) {
            setShowAlert(true)
            setTimeout(() => {
                setShowAlert(false)
            }, 3000)
        }
    }, [notification])

    const openCreateWindow = () => {
        setShowCreateUpdateWindow(true)
        if (dataToSave) {
            setDataToSave({})
        }
    }

    const openUpdateWindow = () => {
        setUpdateClicked(true)
        setShowCreateUpdateWindow(true)
        if (Object.keys(dataToSave).length > 0) {
            setDataToSave({})
        } else {
            const selectedId = selectedRows.values().next().value
            const filteredObject = stateData.find(item => item.id === selectedId)
            setDataToSave(filteredObject)
        }
    }

    const resetLocalStates = () => {
        setUpdateClicked(false)
        setShowCreateUpdateWindow(false)
        setDataToSave({})
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (windowRef.current && !windowRef.current.contains(event.target)) {
                resetLocalStates()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const location = useLocation()

    useEffect(() => {
        for (const id of Object.keys(rowRefs.current)) {
            const rowElement = rowRefs.current[id]
            if (rowElement) {
                rowElement.classList.remove('highlighted')
            }
        }

        setSelectedRows(new Set())
        rowRefs.current = {}
    }, [location.pathname])

    const handleRowClick = (id) => {
        if (selectedRows.has(id)) {
            setSelectedRows(new Set([...selectedRows].filter(rowId => rowId !== id)))
            rowRefs.current[id].classList.remove('highlighted')
        } else {
            setSelectedRows(new Set([...selectedRows, id]))
            rowRefs.current[id].classList.add('highlighted')
        }
    }

    const handleCreateUpdate = async (event) => {
        // Prevent default form submission behavior
        event.preventDefault()

        try {
            if (updateClicked) {
                await dispatch(reducer.updateRecord({
                    path: fullBackPath,
                    body: dataToSave
                }))
            } else {
                await dispatch(reducer.createRecord({
                    path: fullBackPath,
                    body: dataToSave
                }))
            }

            resetLocalStates()
            setSelectedRows(new Set())

        } catch (error) {
            console.log('Error during createUpdate:', error)
        }
    }

    const handleDelete = async () => {
        try {
            const selectedIds = new Set(selectedRows)
            for (const id of selectedIds) {
                selectedIds.delete(id)
                setSelectedRows(selectedIds)

                rowRefs.current[id].classList.remove('highlighted')

                await dispatch(reducer.deleteRecord(`${fullBackPath}/${id}`))
            }
        } catch (error) {
            console.error('Error during delete try:', error)
        }
    }

    const sortedData = useMemo(() => {

        if (!Array.isArray(stateData)) {
            return []
        }

        let sortableData = [...stateData]
        if (sortConfig !== null) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1
                }
                return 0
            })
        }
        return sortableData
    }, [stateData, sortConfig])

    const requestSort = key => {
        let direction = 'ascending'
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending'
        }
        setSortConfig({ key, direction })
    }



    if (loading) {
        return <div className='default'>{t('loading')}</div>
    }
    if (!stateData || !Array.isArray(stateData) || stateData.length === 0) {
        return <div className='default'>{t('noData')}</div>
    }

    const headers = Object.keys(stateData[0])

    return (
        <div className='abstract-container'>
            <div className='header'>
                <p className='header-title'>{t(title)}</p>
                {!showCreateUpdateWindow &&
                    <div className='header-buttons'>
                        <button onClick={openCreateWindow}>{t('create')}</button>
                        {selectedRows.size === 1 && <button onClick={openUpdateWindow}>{t('update')}</button>}
                        {selectedRows.size !== 0 && <button onClick={handleDelete}>{t('delete')}</button>}
                    </div>
                }
            </div>
            {showCreateUpdateWindow && (
                <div className='create-update-window-wrapper'>
                    <CreateUpdateForm
                        dataToSave={dataToSave}
                        setDataToSave={setDataToSave}
                        headers={headers}
                        updateClicked={updateClicked}
                        onSubmit={handleCreateUpdate}
                        onCancel={resetLocalStates}
                        formRef={windowRef}
                        t={t}
                    />
                </div>
            )}
            {showAlert && (
                <AlertMessage message={t(notification.template,
                    notification.parameters ? { id: notification.parameters[0] } : {})} />
            )}
            <div className='abstract-table'>
                <table>
                    <thead>
                        <tr className='abstract-table-header'>
                            {headers.map((header, index) => (
                                <th key={index} onClick={() => requestSort(header)}>
                                    {(formatHeader(t(header)))}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((row) => (
                            <tr
                                key={row.id}
                                className='abstract-table-row'
                                ref={(el) => rowRefs.current[row.id] = el}
                                onClick={() => handleRowClick(row.id)}>
                                {headers.map((header) => (
                                    <td key={header}>{row[header]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination
                perPage='15'
                pageNumber='1'
                totalPages='25'
                t={t}
                onPageNumberChange={() => { }} //provide a real handler
                onPerPageChange={() => { }} //provide a real handler
            />
        </div>
    )
}

export default AbstractTable