import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchbarDropdown.css';

function DropdownComponent({ onItemSelected }) {
  const [filter, setFilter] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [dropdownItems, setDropdownItems] = useState([]);

  useEffect(() => {
    async function fetchDropdownItems() {
      try {
        const response = await axios.get('http://127.0.0.1:3001/users/subreddits'); // Adjust the endpoint URL
        const subredditLabels = response.data.map(subreddit => subreddit.id); // Extract labels from the response
        setDropdownItems(subredditLabels);
      } catch (error) {
        console.error('Error fetching dropdown items:', error);
      }
    }
    
    fetchDropdownItems();
  }, []);
  
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleDropdownItemClick = (itemLabel) => {
    if (selectedItems.length < 3 && !selectedItems.includes(itemLabel)) {
      setSelectedItems([...selectedItems, itemLabel]);
      onItemSelected([...selectedItems, itemLabel]);
      setFilter('');
    }
  };

  const handleRemoveItem = (itemLabel) => {
    const updatedSelectedItems = selectedItems.filter((item) => item !== itemLabel);
    setSelectedItems(updatedSelectedItems);
    onItemSelected(updatedSelectedItems);
  };

  const isSearchDisabled = selectedItems.length >= 3;

  return (
    <div>
      <div>
        <input
          className='better-inputs'
          type="text"
          placeholder="Subreddit Ara"
          value={filter}
          onChange={handleFilterChange}
          disabled={isSearchDisabled}
        />
        {filter && (
          <div id="myDropdown" className="dropdown-content show">
            {dropdownItems && dropdownItems.map((label) => ( 
              <a
                key={label} // Use "label" as the key
                href={`#${label}`} // Use "label" in href
                style={{
                  display: label.toUpperCase().includes(filter.toUpperCase()) ? '' : 'none',
                }}
                onClick={() => handleDropdownItemClick(label)}
              >
                {label}
              </a>
            ))}
          </div>
        )}

      </div>

      {selectedItems.length > 0 && (
        <div className="selected-items">
          <h3 className='better-labels'>Seçili Subredditler</h3>
          <ul>
            {selectedItems.map((item, index) => (
              <li key={index}>
                {item}
                <button className='buttons' type="button" onClick={() => handleRemoveItem(item)}>Seçimi kaldır</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DropdownComponent;
