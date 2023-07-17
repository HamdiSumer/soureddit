import './App.css';
import PostList from './components/Post/Posts';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const App = () => {
  return( 
    <BrowserRouter>
      <Routes>
        <Route path="posts" element={<PostList />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
