import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';

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
  }, [userId, selectedItems]);
  
  return (
    <div>
      <h2>Selected Subreddits:</h2>
      <ul>
        {selectedItems.map((subreddit, index) => (
          <li key={index}>{subreddit}</li>
        ))}
      </ul>
      <div>
        <ul>
          {globalPosts.map((post) => (
            <li className='mx-2 rounded-md shadow-orange shadow-sm py-2 my-2 border-orange border-2' key={post._id}>
              <p className="inline"> r/{post.subreddit}</p>
              <p className="inline">Postessd by u/{post.author}</p>
              <p className="inline">  {post.post_timestamp}</p>
              <h3>Title:{post.title}</h3>
              <h3>Summary:{post.body}</h3>
              <h3>Comments:{post.comments}</h3>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Posts;
