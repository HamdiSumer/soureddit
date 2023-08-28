import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from '../SearchbarDropdown/SearchbarDropdown';
import '../Base/Base.css';

function SubSelections({ userId, onUpdateSelectedItems }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [updatedItems, setUpdatedItems] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [previousSelections, setPreviousSelections] = useState([]);
  const [subredditChangeAttempts, setSubredditChangeAttempts] = useState(0);
  const [updateChance, setUpdateChance] = useState();

  // Fetch user's subreddit selections from the backend
  const fetchUserSubreddits = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:3001/users/${userId}`);
      setSelectedItems(response.data.user.selectedItems);
      setUpdatedItems(response.data.user.selectedItems);
      setPreviousSelections(response.data.user.selectedItems);
    } catch (error) {
      console.error('Error fetching user subreddits:', error);
    }
  };

  useEffect(() => {
    fetchUserSubreddits();
  }, [userId]);

  const handleAddSubreddit = () => {
    if (subredditChangeAttempts < 3) {
      setIsDropdownOpen(!isDropdownOpen);
      if (selectedItems.length >= 3) {
        alert("En fazla 3 Subreddit seçimi yapabilirsiniz!");
      } else {
        setIsDropdownOpen(!isDropdownOpen);
      }
    } else {
      alert("You've reached the maximum number of subreddit change attempts (3).");
    }
  };

  const handleSelectedItems = (newSelectedItems) => {
    const updatedSubreddits = [...selectedItems, ...newSelectedItems];

    // Ensure that the number of selected items doesn't exceed 3
    if (updatedSubreddits.length <= 3) {
      setSelectedItems(updatedSubreddits);
      setSubredditChangeAttempts(subredditChangeAttempts + 1);
    } else {
      alert("En fazla 3 Subreddit seçimi yapabilirsiniz!");
    }
  };

  const handleRemoveSubreddit = (subreddit) => {
    const updatedSubreddits = selectedItems.filter((item) => item !== subreddit);
    setSelectedItems(updatedSubreddits);
  };

  const handleUpdateSelections = async () => {
    // Call your backend API to update the user's subreddit selections
    try {
      const updatedUserData = {
        user: {
          selectedItems: selectedItems,
        },
      };

      await axios.put(`http://127.0.0.1:3001/users/${userId}/selectedItems`, updatedUserData);
      setUpdatedItems(selectedItems);
      onUpdateSelectedItems(selectedItems);
    } catch (error) {
      console.error('Error updating user subreddits:', error);
    }

    // Send data to Django
    const dataToSendDjango = {
      curr_pref: selectedItems,
      old_pref: previousSelections,
    };

    try {
      await axios.post('https://80a9-159-146-79-67.ngrok-free.app/ScrapeReddit/add_subreddits/', dataToSendDjango);
      console.log('Data sent successfully to Django!');
    } catch (error) {
      console.error('Error sending data to Django:', error);
    }
  };

  const fetchUserUpdateChance = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:3001/users/${userId}`);
      setUpdateChance(response.data.user.updateChance);
    } catch (error) {
      console.error('Error fetching user subreddits:', error);
    }
  };

  useEffect(() => {
    fetchUserUpdateChance();
  }, [userId]);

  const calculateRemainingChances = () => {
    return updateChance - subredditChangeAttempts;
  };

  const handleUpdateChances = async () => {
    try {
      const remainingChances = calculateRemainingChances();
      console.log("Remaining Chances: ", remainingChances);
      const updatedUserData = {
        user: {
          updateChance: remainingChances,
        },
      };
      await axios.put(`http://127.0.0.1:3001/users/${userId}/updateChance`, updatedUserData);
    } catch (error) {
      console.error('Error updating user subreddits:', error);
    }
  };

  return (
    <div>
      <h3 className='better-htags'>Subreddit Tercihlerini Değiştir:</h3>
      {selectedItems.length > 0 && !isDropdownOpen && (
        <div className="selected-items">
          <h4 className='better-labels'>
            Kalan Güncelleme Hakkı: {calculateRemainingChances()}
          </h4>
          <h3 className='better-labels'>Seçili Subredditler:</h3>
          <ul className='main-gundem'>
            {selectedItems.map((item) => (
              <li key={item}>
                {item}
                <button className='buttons' type="button" onClick={() => handleRemoveSubreddit(item)}>
                  Seçimi Kaldır
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedItems.length >= 0 && !isDropdownOpen && (
        <div className="dropdown">
          <button
            disabled={selectedItems.length >= 3 || updateChance === 0}
            className={`buttons ${
              selectedItems.length >= 3 || updateChance === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            type="button"
            onClick={handleAddSubreddit}
          >
            Subreddit ekle
          </button>
        </div>
      )}
      {/* Dropdown, isDropdownOpen true olduğunda render edilir */}
      {isDropdownOpen && (
        <div className="dropdown">
          <Dropdown onItemSelected={handleSelectedItems} />
          <button onClick={(handleAddSubreddit) => setIsDropdownOpen(false)} className='buttons' type="button">
            Subreddit'i ekle
          </button>
        </div>
      )}
      <button className='buttons' type="button" onClick={() => {
        handleUpdateSelections();
        handleUpdateChances();
      }}>
        Seçimleri Kaydet
      </button>
    </div>
  );
}

export default SubSelections;
