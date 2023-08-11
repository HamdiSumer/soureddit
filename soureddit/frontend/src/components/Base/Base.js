import React, { useState } from 'react';
import Modal from 'react-modal';
import './Base.css';
import TitlesList from '../Pagination/Pagination';
import Auth from '../User/Auth';
import SignUp from '../User/SignUp';
import SubSelections from '../User/SubSelections';

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

  const handleLoginSuccess = (loginData) => {
    if (loginData.success && loginData.username) {
      setIsLoggedIn(true);
      setUsername(loginData.username);
      setUserIdForSelections('64d3efe730bf1ecc764b49dd'); // Set the user ID here
      setIsLoginModalOpen(false);
      setIsSignUpModalOpen(false);
    }
  }
  const handleLogout = () => {
    setIsLoggedIn(false);
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
            SouReddit
            <span className='header-logo-version-template'>  v.0.0</span>
          </a>
          <form action=''>
            <input type='text' placeholder='Ara' className='header-search-template'></input>
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
            <h2>yaran facebook durum güncellemeleri</h2>
            <p className=''>
              "türk kadınlarıyla yeteri kadar ilgilenmiyorsunuz beyler. yoksa bir insan durduk yere,
              patlıcandan reçel, kabaktan tatlı yapmaz."
            </p>
          </div>
        </main>
      </div>


      <Modal isOpen={isLoginModalOpen} onRequestClose={handleLoginModalClose} contentLabel='Giriş Yap Modalı'>
        <Auth onClose={handleLoginModalClose} onLoginSuccess={handleLoginSuccess} />
      </Modal>

      <Modal isOpen={isSignUpModalOpen} onRequestClose={handleSignUpModalClose} contentLabel='Kayıt Ol Modalı'>
        <SignUp onClose={handleSignUpModalClose} />
      </Modal>
      
      <Modal isOpen={isSubSelectionModalOpen} onRequestClose={handleSubSelectionModalClose} contentLabel='Subreddit Seçim Modalı'>
        <SubSelections userId={userIdforSelections} selectedItems={selectedSubs} onUpdateSelectedItems={handleSubSelectionUpdate} />
      </Modal>


    </body>
  );

});

export default BaseTemplate;
