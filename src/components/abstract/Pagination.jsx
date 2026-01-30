import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const Pagination = ({
    perPage,
    onPerPageChange,
    pageNumber,
    onPageNumberChange,
    totalPages,
    t
}) => (
        <div className='pagination'>
            <label htmlFor='per-page'>{t('perPage')}</label>
            <input
                id='per-page'
                type='number'
                value={perPage}
                min={1}
                onChange={onPerPageChange}
            />
            <ChevronLeftIcon
             onClick={onPageNumberChange}
              />
            <label htmlFor='page-number'>{t('page')}</label>
            <input
                id='page-number'
                type='number'
                value={pageNumber}
                min={1}
                max={totalPages}
                onChange={onPageNumberChange}
            />
            <ChevronRightIcon
             onClick={onPageNumberChange} 
             />
            <p>{t('of')}</p>
            <p>{totalPages}</p>
        </div>
    )

export default Pagination