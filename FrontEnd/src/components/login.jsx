import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// STYLES
const loginStyle = {
  overall: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '',

  },
  inner: {
    textAlign: 'center',
    borderRadius: '20px',
    padding: '2% 4%',
    boxShadow: '0px 0px 10px 3px #000',
  }
}


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        // console.log(data)
        setIsLoggedIn(true)
        localStorage.setItem('user', username);
        navigate('/home');
      } else {
        setError('Invalid username or password!');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setIsLoggedIn(true)
      navigate('/home')
    }
  }, []);

  return (
    <div style={loginStyle.overall} className='body'>
      {!isLoggedIn && (<div style={loginStyle.inner} className='content'>
        <h3 className='mb-4'>PECA ASSISTANT</h3>
        <form onSubmit={handleSubmit} className='mb-3'>
          <div className='mb-2'>
            <input
              className='col-12'
              type="text"
              id="username"
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className='mb-2 '>
            <input
              className='col-12'
              type="password"
              id="password"
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button type="submit" className='btn login'>Login <FontAwesomeIcon icon={faRightToBracket}></FontAwesomeIcon></button>
          </div>
        </form>
        {error && <p style={{ fontStyle: 'italic' }} className='mt-1'>{error}</p>}
        <div className='clr2'>Don't have an account? <a href='/signup'>Register</a></div>
      </div>)}
    </div>
  );
};

export default Login;
