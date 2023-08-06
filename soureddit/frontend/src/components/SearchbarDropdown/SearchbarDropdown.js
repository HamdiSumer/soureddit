import React, { useState } from 'react';
import './SearchbarDropdown.css'; // Import the corresponding CSS file

function DropdownComponent({ onItemSelected }) {
  const [filter, setFilter] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleDropdownItemClick = (itemLabel) => {
    if (selectedItems.length < 3 && !selectedItems.includes(itemLabel)) {
      setSelectedItems([...selectedItems, itemLabel]);
      onItemSelected([...selectedItems, itemLabel]); // Notify parent component about selected items
      setFilter(''); // Clear the filter after selecting an item
    }
  };

  const handleRemoveItem = (itemLabel) => {
    const updatedSelectedItems = selectedItems.filter((item) => item !== itemLabel);
    setSelectedItems(updatedSelectedItems);
    onItemSelected(updatedSelectedItems); // Notify parent component about updated selected items
  };

  const dropdownItems = [
    { id: 'about', label: 'About' },
    { id: 'base', label: 'Base' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
    { id: 'custom', label: 'Custom' },
    { id: 'support', label: 'Support' },
    { id: 'tools', label: 'Tools' },
  ];

  const isSearchDisabled = selectedItems.length >= 3;

  return (
    <div>
      <div className="dropdown">
        <input
          type="text"
          placeholder="Search.."
          id="myInput"
          value={filter}
          onChange={handleFilterChange}
          disabled={isSearchDisabled}
        />
        {filter && (
          <div id="myDropdown" className="dropdown-content show">
            {dropdownItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                style={{
                  display: item.label.toUpperCase().includes(filter.toUpperCase()) ? '' : 'none',
                }}
                onClick={() => handleDropdownItemClick(item.label)}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Render selected items */}
      {selectedItems.length > 0 && (
        <div className="selected-items">
          <h3>Seçilen Subredditler:</h3>
          <ul>
            {selectedItems.map((item, index) => (
              <li key={index}>
                {item}
                <button type="button" onClick={() => handleRemoveItem(item)}>Sil</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DropdownComponent;
