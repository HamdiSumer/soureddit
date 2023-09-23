import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import './Post.css'
import redditLogo from '../img/reddit-logo-16.png';
import likeIcon from '../img/icons8-heart-50.png'
import saveIcon from '../img/icons8-bookmark-24.png'
import linkIcon from '../img/icons8-share-rounded-24.png'
import sendIcon from '../img/icons8-send-24.png'

function Posts({ userId }) {
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

  const formatTimestamp = (timestamp) => {
    return timestamp.replace('T', ' ');
  };
    
  return (
    <div>
      
      <div className='flex-col justify-center items-center mt-2'>
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
                      <p className='inline text-2xs text-gray-500'>&nbsp;at {formatTimestamp(post.post_timestamp)}</p>
                  </div>
                </div>

                <div id='title-logo' className='flex items-center text-md font-semibold' style={{ marginLeft: '-5%' }}>
                  {/* Use flex and items-center to align img and title in the same row */}
                  <img src={redditLogo} alt="Reddit Logo" className="w-8 h-8" viewBox="0 0 20 17" fill="currentColor" />
                  <a className='inline ml-4' >{post.title}</a>
                  {/* Adjust the marginLeft value as needed */}
                </div>
                <p className='ml-6 mb-2'>{post.body}</p>
                <div class="comments-divider">
                  <hr className='ml-1'></hr>
                  <span className='text-sm'>Comments</span>
                  <hr></hr>
                </div>

                <p className='ml-6 mt-2'>{post.comments}</p>
                <div className='flex items-center justify-between mt-3'>
                  <div className='flex items-center mb-2 ml-1'>
                    <img src={likeIcon} className="w-4 h-4" viewBox="0 0 20 17" fill="currentColor" />
                    <p className=' inline font-normal text-xs'>&nbsp;99 people liked this post</p>
                  </div>
                  <div className='flex items-center mb-2 justify-between'>
                    <a href={post.url} ><img  src={linkIcon} className="w-6 h-6" viewBox="0 0 20 17" fill="currentColor" /></a>
                    <img src={saveIcon} className="w-6 h-6" viewBox="0 0 20 17" fill="currentColor" />
                    <img src={sendIcon} className="w-6 h-6" viewBox="0 0 20 17" fill="currentColor" />
                  </div>  
                </div>
              </div>

            </li>
          ))}
        </ul>
      </div>



    </div>
  );
}

export default Posts;
