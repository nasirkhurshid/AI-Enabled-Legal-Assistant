import { React, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons'

const Header = (props) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [read, setRead] = useState(false)
    const [menu, setMenu] = useState(false)

    const handleButtonClick = (event) => {
        event.preventDefault()
        props.onSearch(searchQuery)
        setRead(false)
    }

    const handleRead = () => {
        setRead(!read)
        props.onRead()
    }

    const handleChat = () => {
        props.onChat()
    }

    const handleSession = () => {
        props.onLogout()
    }

    const showMenu = () => {
        setMenu(!menu)
    }


    return (
        <div className='bg1 header'>
            <button id='menuSlider' className='d-md-none' onClick={showMenu}><FontAwesomeIcon icon={faBars}/></button>
            {menu && <div id='menu' className='bg1 p-2 w-100 d-md-none d-flex justify-content-center align-items-center' style={{borderBottom:'1px solid #caa472'}}>
                <div className='me3'>
                    <button className='menu-btn pe-2 ps-2' onClick={handleChat}>Chat</button>
                </div>
                <div className='me3'>
                    <button className='menu-btn pe-2 ps-2' onClick={handleRead}>{read ? 'Hide' : 'Read'} Laws</button>
                </div>
                <div className='me1 fs-5'>
                    <button className='logout pe-2 ps-2' onClick={handleSession}>Logout</button>
                </div>
            </div>}

            <div className='container-fluid'>
                <div className='row pt-2 pb-2'>
                    <div className='col-12 col-md-7 text-center text-md-start d-flex flex-column justify-content-center flex-md-row justify-content-md-start align-items-center' style={{}}>
                        <div className='col-10 col-md-3 m-2 ms-3 me-3 fw-bold' style={{ fontSize: '1.3em' }}>PECA ASSISTANT</div>

                        <form className='col-10 col-md-8 form-inline' action='' method='GET' onSubmit={handleButtonClick}>
                            <span className='input-group'>
                                <input style={{ borderRadius: '20px 0 0 20px' }} type="text" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} name="query" id='search' className="form-control rounde input" placeholder="Search by keywords" />

                                <button style={{ borderRadius: '0 20px 20px 0' }} className="clr1 button search-btn form-group" type='submit'>Search</button></span>
                        </form>
                    </div>
                    <div className='d-none d-md-flex col-md-5 d-flex justify-content-end align-items-center'>
                        <div className='me-3'>
                            <button className='menu-btn pe-2 ps-2' onClick={handleChat}>Chat</button>
                        </div>
                        <div className='me-3'>
                            <button className={`menu-btn pe-2 ps-2 ${read ? 'read' : ''}`} onClick={handleRead}>{read ? 'Hide' : 'Read'} Laws</button>
                        </div>
                        <div className='me-1 fs-5'>
                            <button className='pe-2 ps-2 logout' onClick={handleSession}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
