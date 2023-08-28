import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Posts({ userId, onUpdateSelections  }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [posts, setPosts] = useState([]); // Initialize an empty array for posts

  // Fetch user's subreddit selections from the backend
  const fetchUserSubreddits = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:3001/users/${userId}`);
      setSelectedItems(response.data.user.selectedItems);
    } catch (error) {
      console.error('Error fetching user subreddits:', error);
    }
  };

  // Fetch all posts from the backend
  const fetchAllPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/posts`);
      // Handle the fetched posts here
      console.log('Fetched posts:', response.data);
      // Set the fetched data in the component state
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching all posts:', error);
    }
  };

  useEffect(() => {
    fetchUserSubreddits();
    fetchAllPosts();
  }, [userId]);
  useEffect(() => {
    fetchUserSubreddits();
    fetchAllPosts();
  }, [userId, onUpdateSelections]);

  // Filter posts that match the selectedItems
  const filteredPosts = posts.filter((post) => selectedItems.includes(post.subreddit));

  return (
    <div>
      <h2>Selected Subreddits:</h2>
      <ul>
        {selectedItems.map((subreddit, index) => (
          <li key={index}>{subreddit}</li>
        ))}
      </ul>

      <h2>Fetched Posts:</h2>
      <ul>
        {filteredPosts.map((post) => (
          <li key={post._id}>
            <h3>Author:</h3>
            <p>{post.author}</p>

            <h3>Title:</h3>
            <p>{post.title}</p>

            <h3>Summary:</h3>
            <p>{post.summary}</p>

            <h3>Subreddit:</h3>
            <p>{post.subreddit}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Posts;
