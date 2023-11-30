import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faComments, faClockRotateLeft, faC } from '@fortawesome/free-solid-svg-icons';


const Sidebar = (props) => {
  const navigate = useNavigate()
  const sidebarItems = props.days;
  const [activeChat, setActiveChat] = useState(null);

  const handleListClick = (event) => {
    const selectedDate = event.currentTarget.textContent
    setActiveChat(selectedDate);
    props.loadMessages(selectedDate)
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header"><FontAwesomeIcon icon={faComments} style={{marginRight:'5px'}}/>Chats with CyberBot</div>
      <ul className="sidebar-list">
        {sidebarItems.map((item, index) => (
          <li onClick={handleListClick} key={index} className={item === activeChat ? 'active-chat' : ''}>          
            {item === activeChat ? <FontAwesomeIcon icon={faComment} style={{marginRight:'5px'}}></FontAwesomeIcon>
            : <FontAwesomeIcon icon={faClockRotateLeft} style={{marginRight:'5px'}}></FontAwesomeIcon>  
          }
            {item}</li>
        ))}
      </ul>
      <button className='m-2 button logout' onClick={() => navigate('/home')}>Go to Home Page</button>
    </div>
  );
};

export default Sidebar;
