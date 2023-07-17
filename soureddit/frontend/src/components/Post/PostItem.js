import React from "react";

import './PostItem.css';

const PostItem=props =>{
    return(
        <li className="post-item">
            <div className="post-item__content">
                <div className="post-item__title">
                    <h2>{props.title}</h2>
                </div>
                <div className="post-item__entry">
                    <h2>{props.entry}</h2>
                </div>
            </div>
        </li>
    );
};

export default PostItem;