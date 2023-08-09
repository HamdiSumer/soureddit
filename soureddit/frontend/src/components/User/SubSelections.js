import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SubSelections({ userId, onUpdateSelectedItems }) {
  const [newSubreddit, setNewSubreddit] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  // Fetch user's subreddit selections from the backend
  const fetchUserSubreddits = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:3001/users/${userId}`, {
        params: {
          selectedItems: selectedItems // Pass the selectedItems array as a query parameter
        }
      });
      setSelectedItems(response.data.user.selectedItems);
    } catch (error) {
      console.error('Error fetching user subreddits:', error);
    }
  };

  useEffect(() => {
    fetchUserSubreddits();
  }, [userId]);

  const handleInputChange = (event) => {
    setNewSubreddit(event.target.value);
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
  // Call your backend API to update the user's subreddit selections
const updateSubredditsInDatabase = async (newSelectedItems) => {
  try {
    const updatedUserData = {
      selectedItems: newSelectedItems
    };

    await axios.put(`http://127.0.0.1:3001/users/64d3efe730bf1ecc764b49dd`, updatedUserData);
    onUpdateSelectedItems(newSelectedItems);
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
            {selectedItems && selectedItems.map((item, index) => (
              <li key={index}>
                {item}
                <button type="button" onClick={() => handleRemoveSubreddit(item)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="subreddit-input">
        <input
          type="text"
          placeholder="Enter subreddit"
          value={newSubreddit}
          onChange={handleInputChange}
          disabled={selectedItems.length >= 3}
        />
        <button type="button" onClick={handleAddSubreddit} disabled={selectedItems.length >= 3}>
          Add
        </button>
      </div>
    </div>
  );
}

export default SubSelections;
