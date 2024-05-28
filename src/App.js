


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
import Sidebar from './components/layouts/Sidebar';
import Home from './components/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { useAuth } from './components/context/AuthContext';
import Account from './components/Account';
import PostList from './components/Blog/PostList';
import PostForm from './components/Blog/PostForm';
import axios from './components/config/axios';
import { useEffect } from 'react';
import CommentEdit from './components/Blog/comment/commentEdit';
import PostEdit from './components/Blog/PostEdit';
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { user, dispatch } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/users/profile', {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        dispatch({ type: 'LOGIN', payload: { account: response.data } });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (localStorage.getItem('token')) {
      fetchUserProfile();
    }
  }, [dispatch]);
  const registerIn=()=>{
    toast("successfully Registered !!")
     }
  const loggedIn=()=>{
    toast("successfully logged !!")
     }

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} handleLogout={handleLogout} />
      <div className="flex flex-1">
       
          {/* <Sidebar /> */}
          <div className="container mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login loggedIn={loggedIn}/>} />
              <Route path="/register" element={<Register registerIn={registerIn}/>} />
              <Route path="/account" element={<Account />} />
              <Route path="/list-posts" element={<PostList />} />
              <Route path="/post-form" element={<PostForm />} />
              <Route path='/api/posts/:postId/comments/:commentId' element={<CommentEdit />} />
              <Route path='/api/posts/:postId' element={<PostEdit />} />
             
            </Routes>
          </div>
      
      </div>
      <Footer />
      <ToastContainer/>
    </div>
  );
}

export default App;

