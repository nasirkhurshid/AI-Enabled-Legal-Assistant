import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// function formatDate(date) {
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const year = date.getFullYear();
//   return `${day}/${month}/${year}`;
// }


const Sidebar = (props) => {
  const navigate = useNavigate()
  const sidebarItems = props.days;
  // const [activeChat, setActiveChat] = useState(formatDate(new Date()));
  const [activeChat, setActiveChat] = useState(null);

  const handleListClick = (event) =>{
    const selectedDate = event.currentTarget.textContent
    setActiveChat(selectedDate);
    props.loadMessages(selectedDate)
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">Chats with CyberBot</div>
      <ul className="sidebar-list">
        {sidebarItems.map((item, index) => (
          <li onClick={handleListClick} key={index} className={item === activeChat ? 'active-chat' : ''}>{item}</li>
        ))}
      </ul>
      <button className='m-2 button logout' onClick={()=>navigate('/home')}>Go to Home Page</button>
    </div>
  );
};

export default Sidebar;
