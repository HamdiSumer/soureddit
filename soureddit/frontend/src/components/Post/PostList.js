import React from "react";
import PostItem from './PostItem'
import './PostList.css';

const PostList= props =>{
    if(props.items.length === 0){
        return(<div className="center">
            <h2>Post yok</h2>
        </div>
        );
    }
    return(
    <ul className="post-list">
        {props.items.map(post => (
        <PostItem 
        key={post.id}
        id={post.id} 
        title={post.title} 
        entry={post.entry} 
        />
        ))}
    </ul>
    ); 

};

export default PostList;