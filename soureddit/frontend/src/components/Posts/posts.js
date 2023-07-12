import React from "react";
import './posts.css';


const PostList= props =>{
    return(
        <ul className="post-list">{
            props.posts.map((post)=>{
                return <li key={post.id}>{post.text}</li>;
            })
        }
        </ul>
    );
};

export default PostList;