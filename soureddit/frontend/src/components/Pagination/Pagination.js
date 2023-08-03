import React, { useState } from 'react';
import './Pagination.css'

const TitlesList = () => {
  // Assuming you have an array of titles as follows:
  const allTitles = [
    "GündemdekilerGündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
    "Gündemdekiler",
  ];

  const titlesPerPage = 50; // Number of titles to display per page

  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the indexes of titles to be displayed on the current page
  const startIndex = (currentPage - 1) * titlesPerPage;
  const endIndex = startIndex + titlesPerPage;
  const currentTitles = allTitles.slice(startIndex, endIndex);

  // Handle pagination button clicks
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Generate pagination buttons
  const paginationButtons = [];
  const totalPages = Math.ceil(allTitles.length / titlesPerPage);
  for (let i = 1; i <= totalPages; i++) {
    paginationButtons.push(
      <button className='pagination-buttons' key={i} onClick={() => handlePageChange(i)}>
        {i}
      </button>
    );
  }

  return (
    <div>
      <ul className='better-links-ul'>
        {currentTitles.map((title, index) => (
          <li key={index}>
            <a className='better-links-li' href='#'>
              {title}
            </a>
          </li>
        ))}
      </ul>
      <div>
        <button className='pagination-buttons' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        {paginationButtons}
        <button className='pagination-buttons' onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TitlesList;
