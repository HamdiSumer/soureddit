import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Posts({ userId, onUpdateSelections  }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [posts, setPosts] = useState([]); // Initialize an empty array for posts
  const [globalPosts, setGlobalPosts] = useState([]);
  const [subreddits] = useState([]); // Adjust initial subreddits as needed
  // Fetch user's subreddit selections from the backend
  const fetchUserSubreddits = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:3001/users/${userId}`);
      setSelectedItems(response.data.user.selectedItems);
    } catch (error) {
      console.error('Error fetching user subreddits:', error);
    }
  };
  // //! BU KISIM POSTLAR FİLTRELENMİŞ ŞEKİLDE GELDİĞİNDE GÜNCELLENECEK
  // // Fetch all posts from the backend
  // const fetchAllPosts = async () => {
  //   try {
  //     const response = await axios.get(`http://localhost:3001/posts`);
  //     // Handle the fetched posts here
  //     console.log('Fetched posts:', response.data);
  //     // Set the fetched data in the component state
  //     setPosts(response.data.posts);
  //   } catch (error) {
  //     console.error('Error fetching all posts:', error);
  //   }
  // };
  // //! BU KISIM POSTLAR FİLTRELENMİŞ ŞEKİLDE GELDİĞİNDE GÜNCELLENECEK
  // useEffect(() => {
  //   fetchUserSubreddits();
  //   fetchAllPosts();
  // }, [userId]);
  // useEffect(() => {
  //   fetchUserSubreddits();
  //   fetchAllPosts();
  // }, [userId, onUpdateSelections]);

  // // Filter posts that match the selectedItems
  // const filteredPosts = posts.filter((post) => selectedItems.includes(post.subreddit));

  //TODO DJANGODAN SUMMERIZE EDİLMİŞ POSTLARI ÇEKEN GET REQUEST
  useEffect(() => {
       fetchUserSubreddits();
     }, [userId]);

     const fetchGlobalPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/ScrapeReddit/summarized_data/?subreddit=['${selectedItems}']`)
        // Set the fetched data in the component state
        setGlobalPosts(response.data);
      } catch (error) {
        console.error('Error fetching all posts:', error);
      }
    };
    useEffect(() => {
      fetchUserSubreddits();
      fetchGlobalPosts(); // Call fetchGlobalPosts here to fetch data when the component mounts
    }, [userId, selectedItems]);
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
        {globalPosts.map((post) => (
          <li key={post._id}>
            <h3>Author:{post.author}</h3>

            <h3>Title:{post.title}</h3>

            <h3>Summary:{post.body}</h3>

            <h3>Comments:{post.comments}</h3>

            <h3>Subreddit: {post.subreddit}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Posts;
