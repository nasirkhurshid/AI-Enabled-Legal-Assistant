import React, { useEffect, useRef, useState } from 'react'
import ChatBox from './bot'
import Sidebar from './sidebar'
import { Navigate, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCircleXmark } from '@fortawesome/free-solid-svg-icons'

function ChatScreen() {
  const navigate = useNavigate()
  const ref = useRef()
  const username = localStorage.getItem('user')
  const [mobile, setMobile] = useState(false)
  const [head, setHead] = useState(null)
  const [days, setDays] = useState([])
  const [messages, setMessages] = useState([])
  const [resetKey, setResetKey] = useState(0);
  const [right, setRight] = useState(false)
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);
  if (formattedDate !== days[0]) {
    days.unshift(formattedDate)
  }

  var newArray
  const loadConversations = async (username) => {
    console.log(username)
    try {
      const response = await fetch(`http://127.0.0.1:5000/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username }),
      });

      if (response.status === 200) {
        const data = await response.json();
        setDays(data)
      } else {
        console.log('No data fetched!');
      }
    } catch (error) {
      console.error('Error:', error);
    }

  }

  const loadMessages = async (date) => {
    try {
      // console.log(username, date)
      const response = await fetch(`http://127.0.0.1:5000/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, date: date }),
      });

      if (response.status === 200) {
        const data = await response.json();

        newArray = []
        data.forEach((obj) => {
          newArray.push({ text: obj.message, isUser: true });
          newArray.push({ text: obj.response, isUser: false });
        });
        setMessages(newArray)
        setHead(date)
      } else {
        console.log('No data fetched!');
      }
    } catch (error) {
      console.error('Error:', error);
    }

  }

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const handleClick = () => {
    setRight(!right)
    setMobile(!mobile)
    // console.log(ref.current.className)
  }

  useEffect(() => {
    loadConversations(username)
  }, [])

  useEffect(() => {
    setHead(head)
    // console.log('head',head)
  }, [head])

  useEffect(() => {
    setMessages(messages);
    // console.log('useEffect messages ', messages)
    setResetKey(prevKey => !prevKey);
  }, [messages]);

  if (username) {
    return (
      <div className='d-flex' style={{}}>
        <div ref={ref} className={`side ${mobile ? 'history1' : 'history'}`} style={{ position: 'fixed' }}><Sidebar loadMessages={loadMessages} days={days}></Sidebar></div>
        {!right && <div className='slider'><button className='slider-button' onClick={handleClick}><FontAwesomeIcon icon={faBars} /></button></div>}
        {right && <div className='slider2'><button className='slider-button' onClick={handleClick}><FontAwesomeIcon icon={faCircleXmark} /></button></div>}
        <div className='botscreen'><ChatBox key={resetKey} msgs={messages} head={head}></ChatBox></div>
      </div>
    )
  }
  else {
    return <Navigate to='/'></Navigate>
  }
}

export default ChatScreen