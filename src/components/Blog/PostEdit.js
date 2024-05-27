import { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useParams, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import backgroundImage from '../images/bg3.jpg'; // Import the background image

export default function PostEdit() {
    const [postForm, setPostForm] = useState({
        title: '',
        content: '',
        featuredImage: ''
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { postId } = useParams();

    useEffect(() => {
        // Fetch the existing post data
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/api/posts/${postId}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                setPostForm({
                    title: response.data.title || '',
                    content: response.data.content || '',
                    featuredImage: response.data.featuredImage || ''
                });
                setLoading(false); // Data fetched, set loading to false
            } catch (error) {
                console.error("Error fetching the post data:", error);
            }
        };

        fetchPost();
    }, [postId]);

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
            const response = await axios.put(`/api/posts/${postId}`, postForm, {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            });
            console.log(response.data);
            navigate('/list-posts');
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Display a loading indicator while fetching data
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="max-w-lg mx-auto p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
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
                        Update Post
                    </button>
                </form>
            </div>
        </div>
    );
}
