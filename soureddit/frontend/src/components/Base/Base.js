import React, { useState } from 'react';
import Modal from 'react-modal';
import './Base.css';
import TitlesList from '../Pagination/Pagination';
import Auth from '../User/Auth';
import SignUp from '../User/SignUp';
import SubSelections from '../User/SubSelections';
import logo from '../img/logo.png';
import Posts from'../Posts/Post'

// App elementini belirle
Modal.setAppElement('#root'); // Varsayılan olarak root elementi

const BaseTemplate = React.memo(() => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isSubSelectionModalOpen, setIsSubSelectionModalOpen] = useState(false);
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [userIdforSelections, setUserIdForSelections] = useState(null); // Initialize user ID as null

  const handleLoginModalOpen = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleSignUpModalOpen = () => {
    if (!isLoggedIn) {
      // Open the sign-up modal only if the user is not logged in
      setIsSignUpModalOpen(true);
    }
  };

  const handleSignUpModalClose = () => {
    setIsSignUpModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = async (loginData) => {
    if (loginData.success) {
      setIsLoggedIn(true);
      setUsername(loginData.username);
      setUserIdForSelections(loginData.id); // Set the user ID here
      setIsLoginModalOpen(false);
      setIsSignUpModalOpen(false);
      localStorage.setItem('isLoggedIn', 'true');
    }
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  const handleSubSelectionModalOpen = () => {
    setIsSubSelectionModalOpen(true);
  };
  
  const handleSubSelectionModalClose = () => {
    setIsSubSelectionModalOpen(false);
  };
  
  const handleSubSelectionUpdate = (selectedSubreddits) => {
    setSelectedSubs(selectedSubreddits);
    handleSubSelectionModalClose();
  };
  return (
      <body className='base-template'>
        <div>
          <div className='header-template'>
            <a className='header-logo-template' href='#'>
            <img src={logo} alt="Logo" className='header-logo-template' />
              <span className='header-logo-version-template'> v.0.0</span>
            </a>

            <form action=''>
              <input type='text' placeholder='Subredditleri "r/" şeklinde arayın ' className='header-search-template'></input>
              <button className='search-icon-button' type="submit">Search</button>
            </form>
            <div>
            {isLoggedIn ? (
              <div>
                <span className='header-login-template'>Hoş Geldiniz</span>
                <button className='buttons' onClick={handleSubSelectionModalOpen}>
                  Subreddit Tercihlerini Güncelle
                </button>
                <button className='buttons' onClick={handleLogout}>
                  Çıkış Yap
                </button>
              </div>
            ) : (
    <div>
      <a className='header-login-template' href='#' onClick={handleLoginModalOpen}>
        Giriş Yap
      </a>
      <a className='header-login-template' href='#' onClick={handleSignUpModalOpen}>
        Kayıt Ol
      </a>
    </div>
  )}

            </div>
          </div>
          <main className='main-template'>
            <aside className='main-aside-template'>
              <h2 className='main-gundem'>gündem</h2>
              <TitlesList></TitlesList>
            </aside>
            <div className='main-content-template'>
              <Posts userId={userIdforSelections} selectedItems={selectedSubs} />
            </div>

          </main>
        </div>
        <Modal isOpen={isLoginModalOpen} onRequestClose={handleLoginModalClose} contentLabel='Giriş Yap Modalı' style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background color of the overlay
            zIndex: 1000, // Z-index of the overlay
          },
          content: {
            // Styling for the modal content
            width: '50%',
            maxHeight: '80%',
            margin: '0 auto',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor:'#e8dfd6'
          },
        }}>
          <Auth onClose={handleLoginModalClose} onLoginSuccess={handleLoginSuccess} />
        </Modal>

        <Modal isOpen={isSignUpModalOpen} onRequestClose={handleSignUpModalClose} contentLabel='Kayıt Ol Modalı' style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background color of the overlay
            zIndex: 1000, // Z-index of the overlay
          },
          content: {
            // Styling for the modal content
            width: '50%',
            maxHeight: '80%',
            margin: '0 auto',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor:'#e8dfd6'
          },
        }}>
          <SignUp onClose={handleSignUpModalClose} />
        </Modal>
        
        <Modal isOpen={isSubSelectionModalOpen} onRequestClose={handleSubSelectionModalClose} contentLabel='Subreddit Seçim Modalı' style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background color of the overlay
            zIndex: 1000, // Z-index of the overlay
          },
          content: {
            // Styling for the modal content
            width: '50%',
            maxHeight: '80%',
            margin: '0 auto',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor:'#e8dfd6'
          },
        }}>
          <SubSelections userId={userIdforSelections} selectedItems={selectedSubs} onUpdateSelectedItems={handleSubSelectionUpdate} />
        </Modal>


      </body>
  );

});

export default BaseTemplate;