import { React, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGavel } from '@fortawesome/free-solid-svg-icons';

const Clauses = ({ heading, law, display }) => {
    const [click, setClick] = useState(false)
    const handleClick = () => {
        setClick(!click)
    }
    return (
        <div className='pe-4 ps-4 mt-3 mb-3 text-start' style={{ width: '100%', display: display }}>
            <details className=''>
                <summary onClick={handleClick} className='caps-head'>
                    {click ? <FontAwesomeIcon icon={faGavel} className='me-2 pb-1' style={{color:'##caa472', transform:'rotate(50deg)', transition: 'transform 500ms ease'}}></FontAwesomeIcon>
                        : <FontAwesomeIcon icon={faGavel} className='me-2 pb-1' style={{color:'#caa472'}}></FontAwesomeIcon>
                    }

                    <h4>{heading}</h4></summary>
                <p className='p-2'>{law}</p>
            </details>
        </div>
    );
};

export default Clauses;
