import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/layouts/Header';
import Footer from './components/layouts/Footer';
// import Sidebar from './components/layouts/Sidebar';
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css'; // Import any additional CSS

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

  const registerIn = () => {
    toast("Successfully Registered!!");
  };

  const loggedIn = () => {
    toast("Successfully Logged In!!");
  };

  const postIn = () => {
    toast("Successfully Created Post!!");
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} handleLogout={handleLogout} />
      <div className="flex flex-1 flex-col md:flex-row">
        {/* <Sidebar className="hidden md:block" /> */}
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login loggedIn={loggedIn} />} />
            <Route path="/register" element={<Register registerIn={registerIn} />} />
            <Route path="/account" element={<Account />} />
            <Route path="/list-posts" element={<PostList />} />
            <Route path="/post-form" element={<PostForm postIn={postIn} />} />
            <Route path='/api/posts/:postId/comments/:commentId' element={<CommentEdit />} />
            <Route path='/api/posts/:postId' element={<PostEdit />} />
          </Routes>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
