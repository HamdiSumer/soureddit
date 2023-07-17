import React from "react";
import './Posts.css';
import PostList from "./PostList";


const Posts=()=>{

    const POSTS=[{id :'p1', title:'First Title', entry:'First entry of our blogApp'}];

    return <PostList items={POSTS} />;
}

export default Posts;