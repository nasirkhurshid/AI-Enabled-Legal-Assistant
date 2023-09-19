import React from 'react'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function NoData(props) {
    return (
        <div className='ps-5 pe-5 text-center d-flex flex-column justify-content-center align-items-center fs-4 clr2' style={{ height: '85vh', opacity: '0.5' }}>
            <div>
                <FontAwesomeIcon icon={faMagnifyingGlass} className='clr2 fs-1 mb-2'></FontAwesomeIcon>
            </div>
            <div>{props.text}</div>
        </div>

    )
}

export default NoData