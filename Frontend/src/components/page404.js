import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

function Page404() {
    return (
        <div className='ps-5 pe-5 text-center d-flex flex-column justify-content-center align-items-center fs-2 clr2' style={{ height: '85vh', opacity: '0.5' }}>
            <div>
                <FontAwesomeIcon icon={faXmark} className='clr2 fs-1 mb-2'></FontAwesomeIcon>
            </div>
            <div>Page Not Found!</div>
        </div>
    )
}

export default Page404