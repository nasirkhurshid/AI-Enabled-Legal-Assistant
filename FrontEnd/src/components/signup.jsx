import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

// STYLES
const loginStyle = {
  overall: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'f3895a'
  },
  inner: {
    textAlign: 'center',
    borderRadius: '20px',
    padding: '2% 4%',
    boxShadow: '0px 0px 10px 3px #000',
  }
}

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [length, setLength] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/signup', {
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
      } else if (response.status === 402) {
        setLength(true)
      } else {
        setError('Account already exists!');
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
              placeholder={length ? 'Set length >= 4 (a-zA-Z0-9)' : 'Set username'}
              value={length ? '' : username}
              onClick={() => setLength(false)}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className='mb-2 '>
            <input
              className='col-12'
              type="password"
              id="password"
              placeholder={length ? 'Set length >= 8' : 'Set password'}
              value={length ? '' : password}
              onClick={() => setLength(false)}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button type="submit" className='btn login'>Sign Up <FontAwesomeIcon icon={faRightToBracket}></FontAwesomeIcon></button>
          </div>
        </form>
        {error && <p style={{ fontStyle: 'italic' }} className='mt-1 message'>{error}</p>}
        <div className='clr2'>Already have an account? <a href='/login'>Login</a></div>

      </div>)}
    </div>
  );
};

export default SignUp;
