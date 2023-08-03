import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Users from './Users';

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

  const handleLogin = (e) => {
    e.preventDefault();

    const user = Users.find((user) => user.email === email && user.password === password);

    if (user) {
      onClose();
      alert(`Başarıyla giriş yaptınız: ${user.username}!`);
      onLoginSuccess(user); // Pass the user object to onLoginSuccess
      navigate('/');
    } else {
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
