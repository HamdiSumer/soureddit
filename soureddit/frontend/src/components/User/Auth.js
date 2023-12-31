import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../Base/Base.css';

const Auth = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async(e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:3001/users/login', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password, // Sending the password as plain text to the backend
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to log in. Please try again.');
      }
  
      // Fetch additional user data based on the logged-in user's email
      const userDataResponse = await fetch(`http://127.0.0.1:3001/users/email/${email}`);
      const userData = await userDataResponse.json();

      const loginData = {
        success: true,
        id: userData.user.id,
        username: userData.user.username,
      };

      console.log(loginData); // loginData'ya bakın
      onLoginSuccess(loginData);


      alert(`Başarıyla giriş yaptınız. Hoş geldiniz, ${loginData.username}!`);
      onClose();
      navigate('/');
    } catch (error) {
      alert('Geçersiz e-posta veya şifre. Lütfen tekrar deneyin.');
    }
  };


  return (
    <div className='auth-modal'>
        <div className='login-modal'>
          <h2 className="better-htags">Giriş Yap</h2>
          <form onSubmit={handleLogin}>
            <div className='form-group'>
              <label className='better-labels'htmlFor='email'>E-posta:</label>
              <input className='better-inputs'type='email' id='email' value={email} onChange={handleEmailChange} />
            </div>
            <div className='form-group'>
              <label className='better-labels' htmlFor='password'>Şifre:</label>
              <input className='better-inputs' type='password' id='password' value={password} onChange={handlePasswordChange} />
            </div>
            <button className='buttons' type='submit'>Giriş Yap</button>
            <button className='buttons' type='button' onClick={onClose}>
              Kapat
            </button>
          </form>
        </div>
    </div>
  );
};

export default Auth;
