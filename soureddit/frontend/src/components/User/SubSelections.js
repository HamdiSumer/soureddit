import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from '../SearchbarDropdown/SearchbarDropdown'

function SubSelections({ userId, onUpdateSelectedItems }) {
  const [newSubreddit, setNewSubreddit] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  // Fetch user's subreddit selections from the backend
  const fetchUserSubreddits = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:3001/users/${userId}`);
      setSelectedItems(response.data.user.selectedItems);
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
  
  const handleAddSubreddit = async () => {
    if (newSubreddit.trim() !== '' && selectedItems.length < 3) {
      const updatedSubreddits = [...selectedItems, newSubreddit];
      await updateSubredditsInDatabase(updatedSubreddits);
      setSelectedItems(updatedSubreddits);
      setNewSubreddit('');
    }
  };
  
  const handleRemoveSubreddit = async (subreddit) => {
    const updatedSubreddits = selectedItems.filter((item) => item !== subreddit);
    await updateSubredditsInDatabase(updatedSubreddits);
    setSelectedItems(updatedSubreddits);
  };
  // Call your backend API to update the user's subreddit selections
  const updateSubredditsInDatabase = async (newSelectedItems) => {
    try {
      const updatedUserData = {
        user: {
          selectedItems: newSelectedItems
        }
      };
  
      await axios.put(`http://127.0.0.1:3001/users/${userId}/selectedItems`, updatedUserData); // Update the URL with the correct user ID
      onUpdateSelectedItems(newSelectedItems);
    } catch (error) {
      console.error('Error updating user subreddits:', error);
    }
};

const handleUpdateSelections = async () => {
    await updateSubredditsInDatabase(selectedItems.slice()); // Pass a copy of the selectedItems array
};
  
  


  return (
    <div>
      <h3>Update Your Subreddit Selections:</h3>
      {selectedItems.length > 0 && (
        <div className="selected-items">
          <h3>Selected Subreddits:</h3>
          <ul>
            {selectedItems && selectedItems.map((item, index) => (
              <li key={index}>
                {item}
                <button type="button" onClick={() => handleRemoveSubreddit(item)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="dropdown">
        <Dropdown onItemSelected={handleSelectedItems} />
      </div>
        <button type="button" onClick={handleAddSubreddit} disabled={selectedItems.length >= 3}>
          Add
        </button>
        <button type="button" onClick={handleUpdateSelections}>
          Update Selections
        </button>
      </div>
  );
}

export default SubSelections;
