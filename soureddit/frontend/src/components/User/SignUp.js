import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from '../SearchbarDropdown/SearchbarDropdown';
import '../SearchbarDropdown/SearchbarDropdown.css';

const SignUp = ({ onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedItems, setSelectedItems] = useState([]); // Initialize with an empty array
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    // Validate email and password here (not shown in the code)

    try {
      const response = await fetch('http://127.0.0.1:3001/users/signup', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          password,
          selectedItems // Sending the selected items to the backend
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sign up. Please try again.');
      }

      // Handle successful sign-up
      // For example, you can set the user as logged in using your auth context
      // For now, let's just close the modal and navigate to the homepage after sign-up
      onClose();
      alert(`Successfully signed up as ${username}!`);
      navigate('/');
    } catch (error) {
      alert(error.message || 'Something went wrong. Please try again.');
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSelectedItems = (selectedItems) => {
    setSelectedItems(selectedItems); // Update the selectedItems state
  };
  return (
    <div className="sign-up-modal">
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleSignUp}>
        <div className="form-group">
          <label htmlFor="username">Kullanıcı Adı: </label>
          <input type="text" id="username" value={username} onChange={handleUsernameChange} />
        </div>
        <div className="form-group">
          <label htmlFor="email">E-posta: </label>
          <input type="email" id="email" value={email} onChange={handleEmailChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Şifre: </label>
          <input type="password" id="password" value={password} onChange={handlePasswordChange} />
        </div>
        <div className="form-group">
        <label htmlFor="subs">Subredditler: </label>
        <div className="dropdown">
        <Dropdown onItemSelected={handleSelectedItems} />
        </div>
      </div>
        <button type="submit">Kayıt Ol</button>
      </form>
    </div>
  );
};

export default SignUp;
