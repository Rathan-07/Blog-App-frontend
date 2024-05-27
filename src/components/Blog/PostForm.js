import React, { useState } from "react";
import axios from "../config/axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundImage from '../images/bg1.jpg' // Import the background image

export default function PostForm() {
    const [postForm, setPostForm] = useState({
        title: '',
        content: '',
        featuredImage: ''
    });

    const showToastMessage = () => {
        toast.success("Post created!", {
            position: "top-right",
        });
    };

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPostForm({ ...postForm, [name]: value });
    };

    const handleContentChange = (value) => {
        setPostForm({ ...postForm, content: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/posts', postForm, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            console.log(response.data);
            setPostForm({
                title: '',
                content: '',
                featuredImage: ''
            });
            // showToastMessage();
            alert('Post is created')
            navigate('/list-posts');
        } catch (error) {
            console.log(error);
            toast.error('Failed to create post');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={postForm.title}
                            onChange={handleChange}
                            className="border border-gray-300 px-4 py-2 rounded-md w-full"
                        />
                    </div>

                    <div>
                        <label htmlFor="content" className="block">Content</label>
                        <ReactQuill
                            value={postForm.content}
                            onChange={handleContentChange}
                            theme="snow"
                            className="border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="featuredImage" className="block">Featured Image URL</label>
                        <input
                            type="text"
                            id="featuredImage"
                            name="featuredImage"
                            value={postForm.featuredImage}
                            onChange={handleChange}
                            className="border border-gray-300 px-4 py-2 rounded-md w-full"
                        />
                    </div>

                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                        Post
                    </button>
                </form>
                {/* <ToastContainer /> */}
            </div>
        </div>
    );
}
