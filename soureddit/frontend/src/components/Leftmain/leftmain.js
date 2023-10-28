import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import infoIcon from '../img/icons8-info-50.png'

function Leftmain({ userId }) {
    const [selectedItems, setSelectedItems] = useState([]);
    const [globalPosts, setGlobalPosts] = useState([]);

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
      }, [userId,selectedItems]);
      return (
        <div className='bg-[#f8f8f8] rounded-md shadow-gray-500 shadow-sm'>
          <h2 className='text-center bg-orange text-gray-50 text-md font-medium rounded-t-md'>Seçili Subredditler</h2>
          <ul className=''>
            {selectedItems.map((subreddit, index) => (
              <div>
                <li className='text-md text-black font-normal mt-1 ml-2' key={index}>
                  <span className='text-orange font-bold'>r/&nbsp;</span>
                  <span className='text-black'>{subreddit}</span>
                </li>
              </div>
            ))}
          </ul>
          <div className=' mt-2 border-t p-2'>
              <p className='text-2xs text-gray-500 flex items-center'> <img src={infoIcon} className="w-4 h-4 mr-1" viewBox="0 0 20 17" fill="currentColor" />
              Subreddit tercihlerinizi ayarlar menüsünden değiştirebilirsiniz
              </p>
          </div>
        </div>

      );
}

export default Leftmain;