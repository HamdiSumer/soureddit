import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Users from './Users';

const Auth = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);
  const navigate = useNavigate();
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    // Check if the user exists in the dummy users array
    const user = Users.find((user) => user.email === email && user.password === password);

    if (user) {
      // Handle successful login
      // For example, you can set the user as logged in using your auth context
      // Show the successful login alert with the username
      // For now, let's just close the modal and navigate to the homepage after login
      onClose();
      alert(`Succesfully logged in ${user.username} !`)
      navigate('/');

    } else {
      // Handle incorrect login credentials
      alert('Invalid email or password. Please try again.');
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    // Check if the user with the same email already exists
    const existingUser = Users.find((user) => user.email === email);
    if (existingUser) {
      alert('User with this email already exists. Please try another email.');
      return;
    }

    // If the user doesn't exist, add them to the users array (for demo purposes)
    Users.push({ email, password });

    // Handle successful sign-up
    // For example, you can set the user as logged in using your auth context
    // For now, let's just close the modal and navigate to the homepage after sign-up
    onClose();
    navigate('/');
  };

  const handleLoginModalOpen = () => {
    setIsLoginModalOpen(true);
  };

  const handleSignUpModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <div className="auth-modal">
      {isLoginModalOpen ? (
        <div className="login-modal">
          <h2>Giriş Yap</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">E-posta:</label>
              <input type="email" id="email" value={email} onChange={handleEmailChange} />
            </div>
            <div className="form-group">
              <label htmlFor="password">Şifre:</label>
              <input type="password" id="password" value={password} onChange={handlePasswordChange} />
            </div>
            <button type="submit">Giriş Yap</button>
            <button type="button" onClick={handleSignUpModal}>Hesap Oluştur</button>
          </form>
        </div>
      ) : (
        <div className="signup-modal">
          <h2>Hesap Oluştur</h2>
          <form onSubmit={handleSignUp}>
            <div className="form-group">
              <label htmlFor="email">E-posta:</label>
              <input type="email" id="email" value={email} onChange={handleEmailChange} />
            </div>
            <div className="form-group">
              <label htmlFor="password">Şifre:</label>
              <input type="password" id="password" value={password} onChange={handlePasswordChange} />
            </div>
            <button type="submit">Hesap Oluştur</button>
            <button type="button" onClick={handleLoginModalOpen}>Giriş Yap</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Auth;
