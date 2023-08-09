import React, { useState } from 'react';

function SubSelections({ selectedItems, onUpdateSelectedItems }) {
  const [newSubreddit, setNewSubreddit] = useState('');

  const handleInputChange = (event) => {
    setNewSubreddit(event.target.value);
  };

  const handleAddSubreddit = () => {
    if (newSubreddit.trim() !== '' && selectedItems.length < 3) {
      onUpdateSelectedItems([...selectedItems, newSubreddit]);
      setNewSubreddit('');
    }
  };

  const handleRemoveSubreddit = (subreddit) => {
    const updatedSelectedItems = selectedItems.filter((item) => item !== subreddit);
    onUpdateSelectedItems(updatedSelectedItems);
  };

  return (
    <div>
      <h3>Update Your Subreddit Selections:</h3>
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
      <ul className="selected-items">
        {selectedItems.map((subreddit, index) => (
          <li key={index}>
            {subreddit}
            <button type="button" onClick={() => handleRemoveSubreddit(subreddit)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SubSelections;
