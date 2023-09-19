import React from 'react';
import { Route, Routes} from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/login';
import SignUp from './components/signup';
import Parent from './components/parent';
import ChatScreen from './components/chatScreen';
import Page404 from './components/page404';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/appStyles.css'
import './components/botStyles.css'
import './components/sidebarStyle.css'

function App(props) {
  const [user, setUser] = useState(null)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  document.body.style = 'background-color:#18191a'
  useEffect(() => {
    // Check if a user is logged in by retrieving data from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(storedUser);
      console.log(user)
    }
  }, []);

  const handleChatbotClick = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div className="App body" >
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<SignUp />} />
        <Route exact path="/home" element={<Parent />} />
        <Route exact path="/chat" element={<ChatScreen />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}

export default App;
