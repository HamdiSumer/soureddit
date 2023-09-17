import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import './Post.css'
import redditLogo from '../img/reddit-logo-16.png';

function Posts({ userId, onUpdateSelections }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [globalPosts, setGlobalPosts] = useState([]);

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

  // Function to fetch global posts
  const fetchGlobalPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/ScrapeReddit/summarized_data/?subreddit=['${selectedItems}']`);
      // Set the fetched data in the component state
      setGlobalPosts(response.data);
    } catch (error) {
      console.error('Error fetching all posts:', error);
    }
  };

  useEffect(() => {
    fetchGlobalPosts();
  }, [selectedItems]);
  
  return (
    <div>
      <div className='bg-[#f8f8f8] rounded-md shadow-gray-500 shadow-md'>
        <h2>Selected Subreddits:</h2>
        <ul>
          {selectedItems.map((subreddit, index) => (
            <li key={index}>{subreddit}</li>
          ))}
        </ul>
      </div>
      <div className='flex flex-col justify-center items-center mt-2'>
  <ul>
    {globalPosts.map((post) => (
      <li className='flex rounded-md  mt-4 bg-[#f8f8f8]' key={post._id}>
        <div className='w-w3pcs'>
          <div className='red-line rounded-l-md'></div>
        </div>
        <div className='w-11/12'>
        <div className='flex justify-between mt-2 items-center'>
          <p className='inline text-md text-gray-500 ml-3'>r/{post.subreddit}</p>
          <div className='flex'>
            <p className='inline text-2xs text-gray-500'>Posted by u/{post.author}</p>
            <p className='inline text-2xs text-gray-500'>&nbsp;at {post.post_timestamp}</p>
          </div>
        </div>

          <div id='title-logo' className='flex items-center text-md font-semibold' style={{ marginLeft: '-5%' }}>
            {/* Use flex and items-center to align img and title in the same row */}
            <img src={redditLogo} alt="Reddit Logo" className="w-8 h-8" viewBox="0 0 20 17" fill="currentColor" />
            <a className='inline ml-4' href={post.url}>{post.title}</a>
            {/* Adjust the marginLeft value as needed */}
          </div>
          <p className='ml-6 mb-2'>{post.body}</p>
          <div class="comments-divider">
            <hr className='ml-1'></hr>
            <span className='text-sm'>Comments</span>
            <hr></hr>
          </div>

          <p className='ml-6 mt-2'>{post.comments}</p>
        </div>
      </li>
    ))}
  </ul>
</div>



    </div>
  );
}

export default Posts;
