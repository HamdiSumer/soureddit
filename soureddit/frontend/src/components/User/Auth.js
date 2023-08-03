import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  
      // Başarılı giriş yaptığımızı belirten bir obje oluşturalım.
      const loginData = {
        success: true,
        username: 'example_username', // Burada gerçek kullanıcı adınızı alabilirsiniz
      };
  
      // onLoginSuccess fonksiyonunu çağırarak loginData objesini gönderelim
      onLoginSuccess(loginData);
      alert('Başarıyla giriş yaptınız')
      onClose();
      navigate('/');
    } catch (error) {
      alert('Geçersiz e-posta veya şifre. Lütfen tekrar deneyin.');
    }
  };


  return (
    <div className='auth-modal'>
        <div className='login-modal'>
          <h2>Giriş Yap</h2>
          <form onSubmit={handleLogin}>
            <div className='form-group'>
              <label htmlFor='email'>E-posta:</label>
              <input type='email' id='email' value={email} onChange={handleEmailChange} />
            </div>
            <div className='form-group'>
              <label htmlFor='password'>Şifre:</label>
              <input type='password' id='password' value={password} onChange={handlePasswordChange} />
            </div>
            <button type='submit'>Giriş Yap</button>
            <button type='button' onClick={onClose}>
              Kapat
            </button>
          </form>
        </div>
    </div>
  );
};

export default Auth;
