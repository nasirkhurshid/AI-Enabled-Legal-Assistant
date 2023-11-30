import { React, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGavel, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const Clauses = ({ heading, law, display }) => {
    const [click, setClick] = useState(false)
    const handleClick = () => {
        setClick(!click)
    }
    return (
        <div className='pe-4 ps-4 mt-3 mb-3 text-start' style={{ width: '100%', display: display }}>
            <details className=''>
                <summary onClick={handleClick}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex">
                            {click ? <FontAwesomeIcon icon={faGavel} className='me-2 mt-1 pb-1' style={{ color: '##caa472', transform: 'rotate(45deg)', transition: 'transform 500ms ease' }}></FontAwesomeIcon>
                                : <FontAwesomeIcon icon={faGavel} className='me-2 mt-1 pb-1' style={{ color: '#caa472' }}></FontAwesomeIcon>
                            }

                            <h4>{heading}</h4>
                        </div>
                        <div className="d-flex">
                            {click ? <FontAwesomeIcon icon={faChevronDown} className='me-2 mb-1 pb-1' style={{ color: '##caa472', transform: 'rotate(180deg)', transition: 'transform 500ms ease' }}></FontAwesomeIcon>
                                : <FontAwesomeIcon icon={faChevronDown} className='me-2 mb-1 pb-1' style={{ color: '#caa472', transform: 'rotate(360deg)', transition: 'transform 500ms ease' }}></FontAwesomeIcon>
                            }
                        </div>
                    </div>
                </summary>
                <p className='p-2'>{law}</p>
            </details>
        </div>
    );
};

export default Clauses;
