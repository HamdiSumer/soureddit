import React, { useState } from 'react';
import Modal from 'react-modal';
import './Base.css';
import TitlesList from '../Pagination/Pagination';
import Auth from '../User/Auth';
import SignUp from '../User/SignUp';
import SubSelections from '../User/SubSelections';
import logo from '../img/logo.png';
import redditLogo from '../img/reddit-logo-16.png'
import eksiLogo from '../img/eksi.png'
import twitterLogo from '../img/twitter-logo-change-x-elon-musk-designboom-fb.jpg'
import Posts from'../Posts/Post';
import 'tailwindcss/tailwind.css'; // Import the Tailwind CSS styles


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

            {/*<form action=''>*/}
            {/*  <input type='text' placeholder='Subredditleri "r/" şeklinde arayın ' className='header-search-template'></input>*/}
            {/*  <button className='search-icon-button' type="submit">Search</button>*/}
            {/*</form>*/}

            <a className='header-logo-template' href='#'>
            <img src={logo} alt="Logo" className='header-logo-template' />
              <span className='header-logo-version-template'> v.0.0</span>
            </a>
            <div>
              
            {isLoggedIn ? (
              
              <div className='navbar-contents'>
                <div className='platform-switch'>
                
                <button type="button" class=" bg-orange hover:bg-[#fd4400ff]/90 focus:ring-4 focus:outline-none focus:ring-[#fd4400ff]/50 font-medium rounded-lg text-sm px-3.5 py-1.5 text-center inline-flex items-center dark:focus:ring-[#fd4400ff]/55 mx-2 transition-all duration-300 cursor-pointer filter grayscale hover:grayscale-0">
                    <img src={redditLogo} alt="Reddit Logo" class="w-6 h-6" viewBox="0 0 20 17" fill="currentColor"/>
                </button>
                <button type="button" class=" bg-eksi-yesili hover:bg-eksi-yesili/90 focus:ring-4 focus:outline-none focus:ring-eksi-yesili/50 font-medium rounded-lg text-sm px-3.5 py-1.5 text-center inline-flex items-center dark:focus:ring-eksi-yesili/55 mx-2 transition-all duration-300 cursor-pointer filter grayscale hover:grayscale-0">
                    <img src={eksiLogo} alt="Eksi Logo" class="w-6 h-6" viewBox="0 0 20 17" fill="currentColor"/>
                </button>
                <button type="button" class=" bg-black hover:bg-black/90 focus:ring-4 focus:outline-none focus:ring-black/50 font-medium rounded-lg text-sm px-3.5 py-1.5 text-center inline-flex items-center dark:focus:ring-black/55 mx-2 transition-all duration-300 cursor-pointer filter contrast-50 focus:contrast-100 hover:contrast-100">
                    <img src={twitterLogo} alt="Eksi Logo" class="w-6 h-6" viewBox="0 0 20 17" fill="currentColor"/>
                </button>
                </div>
                <button className='buttons' onClick={handleSubSelectionModalOpen}>
                  Subreddit Tercihlerini Güncelle
                </button>
                <button className='buttons' onClick={handleLogout}>
                  Çıkış Yap
                </button>
              </div>
            ) : (
            <div className='navbar-contents'>
              <button className='buttons' onClick={handleLoginModalOpen}>
                Giriş Yap
              </button>
              <button className='buttons' onClick={handleSignUpModalOpen}>
                Kayıt Ol
              </button>
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