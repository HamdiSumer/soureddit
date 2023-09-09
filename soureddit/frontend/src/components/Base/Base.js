import React, { useState } from 'react';
import Modal from 'react-modal';
import './Base.css';
import TitlesList from '../Pagination/Pagination';
import Auth from '../User/Auth';
import SignUp from '../User/SignUp';
import SubSelections from '../User/SubSelections';
import logo from '../img/logo.png';
import redditLogo from '../img/reddit-logo-16.png';
import eksiLogo from '../img/eksi.png';
import twitterLogo from '../img/twitter-logo-change-x-elon-musk-designboom-fb.jpg';
import Posts from '../Posts/Post';
import 'tailwindcss/tailwind.css';

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
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

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
  const toggleSelection = (platform) => {
    // Create a copy of the selected platforms array
    const updatedSelectedPlatforms = [...selectedPlatforms];

    if (updatedSelectedPlatforms.includes(platform)) {
      // If the platform is already selected, remove it
      const index = updatedSelectedPlatforms.indexOf(platform);
      updatedSelectedPlatforms.splice(index, 1);
    } else {
      // If the platform is not selected, add it
      updatedSelectedPlatforms.push(platform);
    }

    // Update the selectedPlatforms state with the updated array
    setSelectedPlatforms(updatedSelectedPlatforms);
  };

  return (
    <div>
      <body className='base-template'>
        <div className='header-template'>
          <a className='header-logo-template xs:w-1/4 sm:w-2/12 lg:w-1/12' href='#'>
            <img src={logo} alt="Logo" />
            <span className='header-logo-version-template'> v.0.0</span>
          </a>
          {isLoggedIn ? (
            <>
            <div className='xs:w-1/4 sm:w-1/12 lg:w-1/12'>
              <div className='platform-switch absolute'>
                {/* Platform buttons */}
                <button
                  id='redditbutton'
                  type="button"
                  className={`flex ml-2 transition duration-300 ease-in-out hover:shadow-lg hover:shadow-orange bg-orange hover:bg-[#fd4400ff]/90 focus:ring-4 focus:outline-none focus:ring-[#fd4400ff]/50 font-medium rounded-full text-sm px-1.5 py-1.5 text-center inline-flex items-center dark:focus:ring-[#fd4400ff]/55 mx-0.5 transition-all duration-300 cursor-pointer filter ${
                    selectedPlatforms.includes('reddit') ? 'contrast-100' : 'contrast-25'
                  } focus:contrast-100 hover:contrast-100 `}
                  onClick={() => toggleSelection('reddit')}
                >
                  <img src={redditLogo} alt="Reddit Logo" className="w-4 h-4" viewBox="0 0 20 17" fill="currentColor"/>
                </button>

                <button
                  id='eksibutton'
                  type="button"
                  className={`flex mr-2 transition duration-300 ease-in-out hover:shadow-lg hover:shadow-eksi-yesili bg-eksi-yesili hover:bg-eksi-yesili/90 focus:ring-4 focus:outline-none focus:ring-eksi-yesili/50 font-medium rounded-full text-sm px-1.5 py-1.5 text-center inline-flex items-center dark:focus:ring-eksi-yesili/55 mx-1.5 transition-all duration-300 cursor-pointer filter ${
                    selectedPlatforms.includes('eksi') ? 'contrast-100' : 'contrast-25'
                  } focus:contrast-100 hover:contrast-100`}
                  onClick={() => toggleSelection('eksi')}
                >
                  <img src={eksiLogo} alt="Eksi Logo" className="w-4 h-4" viewBox="0 0 20 17" fill="currentColor"/>
                </button>

                <button
                  id='twitterbutton'
                  type="button"
                  className={`flex mr-2  transition duration-300 ease-in-out hover:shadow-lg hover:shadow-black bg-black hover:bg-black/90 focus:ring-4 focus:outline-none focus:ring-black/50 font-medium rounded-full text-sm px-1.5 py-1.5 text-center inline-flex items-center dark:focus:ring-black/55 transition-all duration-300 cursor-pointer filter ${
                    selectedPlatforms.includes('twitter') ? 'contrast-100' : 'contrast-25'
                  } focus:contrast-100 hover:contrast-100`}
                  onClick={() => toggleSelection('twitter')}
                >
                  <img src={twitterLogo} alt="Twitter Logo" className="w-4 h-4" viewBox="0 0 20 17" fill="currentColor"/>
                </button>
              </div>
            </div>
              <div id='buttonsloggedin' className=' xs:w-1/4 sm:w-4/12 lg:w-2/12'>
                <button className='buttons xs:w-1/2' onClick={handleSubSelectionModalOpen}>
                  Ayarlar
                </button>
                {/* Logout button */}
                <button className='buttons xs:w-1/2' onClick={handleLogout}>
                  Çıkış Yap
                </button>
              </div>
            </>
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

        <main className='main-template'>
          <aside className='main-aside-template'>
            <h2 className='main-gundem'>gündem</h2>
            <TitlesList></TitlesList>
          </aside>
          <div className='main-content-template'>
            <Posts userId={userIdforSelections} selectedItems={selectedSubs} />
          </div>
        </main>

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
            backgroundColor: '#e8dfd6',
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
            backgroundColor: '#e8dfd6',
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
            backgroundColor: '#e8dfd6',
          },
        }}>
          <SubSelections userId={userIdforSelections} selectedItems={selectedSubs} onUpdateSelectedItems={handleSubSelectionUpdate} />
        </Modal>
      </body>
    </div>
  );
});

export default BaseTemplate;
