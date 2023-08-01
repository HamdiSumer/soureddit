// SignUp.js
import React, { useState } from 'react';

const SignUp = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    // Perform sign-up logic here
    console.log('Sign-up email:', email);
    console.log('Sign-up password:', password);
    onClose();
  };

  return (
    <div className="sign-up-modal">
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleSignUp}>
        <div className="form-group">
          <label htmlFor="email">E-posta:</label>
          <input type="email" id="email" value={email} onChange={handleEmailChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Şifre:</label>
          <input type="password" id="password" value={password} onChange={handlePasswordChange} />
        </div>
        <button type="submit">Kayıt Ol</button>
      </form>
    </div>
  );
};

export default SignUp;
