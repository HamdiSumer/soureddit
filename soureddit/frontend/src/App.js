import React,{useState} from "react";
import './App.css';
import PostList from "./components/Posts/posts";

const App=()=>{
  //return React.createElement('h1',{},'illllk reactt'); = return <h1>ilk react ornek</h1> --> react allows to use html codes in js file
  const [allPosts,setAllPosts]=useState([//useState framework for auto update.
    {id:'p1',text:'Post1'},
    {id:'p2',text:'Post2'},
    {id:'p3',text:'Post3'}
  ]);
  return( 
    <div>
      <h2 className="Apph2">All Posts</h2>
      <PostList posts={allPosts}/>
    </div>
  );
};

export default App;
