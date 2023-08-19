import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from '../SearchbarDropdown/SearchbarDropdown';
import '../Base/Base.css';

function SubSelections({ userId, onUpdateSelectedItems }) {
  const [newSubreddit, setNewSubreddit] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [updatedItems, setUpdatedItems] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch user's subreddit selections from the backend
  const fetchUserSubreddits = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:3001/users/${userId}`);
      setSelectedItems(response.data.user.selectedItems);
      setUpdatedItems(response.data.user.selectedItems);
    } catch (error) {
      console.error('Error fetching user subreddits:', error);
    }
  };

  useEffect(() => {
    fetchUserSubreddits();
  }, [userId]);

  const handleAddSubreddit = () => {
    console.log(selectedItems.length); // Add this line to check the length
    if (selectedItems.length >= 3) {
      alert("En fazla 3 Subreddit seçimi yapabilirsiniz!");
    } else {
      setIsDropdownOpen(true);
    }
  };
  
  const handleSelectedItems = (selectedItems) => {
    setSelectedItems(selectedItems); // Update the selectedItems state
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
  };

  return (
    <div>
      <h3 className='better-htags'>Subreddit Tercihlerini Değiştir:</h3>
      {selectedItems.length > 0 && !isDropdownOpen && (
        <div className="selected-items">
          <h3 className='better-labels'>Seçili Subredditler:</h3>
          <ul className='main-gundem'>
            {selectedItems.map((item) => (
              <li  key={item}>
                {item}
                <button className='buttons' type="button" onClick={() => handleRemoveSubreddit(item)}>
                  Seçimi Kaldır
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Dropdown'u koşula bağlı olarak render et */}
      {selectedItems.length > 0 && !isDropdownOpen && (
        <div className="dropdown">
          <button onClick={handleAddSubreddit}
           className={`buttons ${
            selectedItems.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''
          }`} type="button" >
            Subreddit ekle
          </button>
        </div>
      )}
      {/* Dropdown, isDropdownOpen true olduğunda render edilir */}
      {isDropdownOpen && (
        <div className="dropdown">
          <Dropdown onItemSelected={handleSelectedItems} />
          <button onClick={() => setIsDropdownOpen(false)} className='buttons' type="button">
            Kapat
          </button>
        </div>
      )}
      <button className='buttons' type="button" onClick={handleUpdateSelections}>
        Seçimleri Kaydet
      </button>
    </div>
  );
}

export default SubSelections;
