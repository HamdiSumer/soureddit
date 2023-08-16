import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from '../SearchbarDropdown/SearchbarDropdown';

function SubSelections({ userId, onUpdateSelectedItems }) {
  const [newSubreddit, setNewSubreddit] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [updatedItems, setUpdatedItems] = useState([]);

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
      <h3>Update Your Subreddit Selections:</h3>
      {selectedItems.length > 0 && (
        <div className="selected-items">
          <h3>Selected Subreddits:</h3>
          <ul>
            {selectedItems &&
              selectedItems.map((item, index) => (
                <li key={index}>
                  {item}
                  <button type="button" onClick={() => handleRemoveSubreddit(item)}>
                    Remove
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
      <div className="dropdown">
        <Dropdown onItemSelected={handleSelectedItems} />
      </div>
      <button
        type="button"
        onClick={handleUpdateSelections}
        disabled={selectedItems.length >= 3 || selectedItems === updatedItems}
      >
        Update Selections
      </button>
    </div>
  );
}

export default SubSelections;
