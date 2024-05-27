import React, { useEffect, useState } from "react";
import axios from "../../config/axios";
import { useParams } from "react-router-dom";
import ContentLoader from "react-content-loader";
export default function CommentEdit() {
    const [comment, setComment] = useState(null);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState('');

    const { postId, commentId } = useParams();

    useEffect(() => {
        const fetchCommentData = async () => {
            try {
                const response = await axios.get(`/api/posts/${postId}/comments/${commentId}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                setComment(response.data);
            } catch (error) {
                setError('Failed to fetch comment');
            }
        };

        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('/api/users/profile', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                setUserId(response.data._id);
            } catch (error) {
                setError('Failed to fetch user profile');
            }
        };

        fetchCommentData();
        fetchUserProfile();
    }, [postId, commentId]);

    const handleEdit = async () => {
        const content = prompt('Enter new content');
        if (content) {
            try {
                const response = await axios.put(`/api/posts/${postId}/comments/${commentId}`, { content }, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                setComment({ ...comment, content: response.data.content });
                
                setError('');
                setTimeout(() => {
                    setError('Comment edited successfully.');
                }, 2000);
            } catch (error) {
                setError(error.response?.data?.error || 'An unknown error occurred');
            }
        }
    };

    const handleDelete = async () => {
        const userConfirm = window.confirm(`Are you sure you want to delete this comment: "${comment.content}"?`);
        if (userConfirm) {
            try {
                await axios.delete(`/api/posts/${postId}/comments/${commentId}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                setComment(null);
                setError('');
                // Show loader for 2 seconds after deletion
                setTimeout(() => {
                    setComment('deleted');
                }, 2000);
            } catch (error) {
                if (error.response?.status === 403) {
                    setError('You are not authorized to delete this comment');
                } else {
                    setError(error.response?.data?.error || 'An unknown error occurred');
                }
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Comment</h2>
                {error && <p className="text-green-500 mb-4">{error}</p>}
                {comment === null ? (
                    <ContentLoader
                        speed={2}
                        width={400}
                        height={160}
                        viewBox="0 0 400 160"
                        backgroundColor="#f3f3f3"
                        foregroundColor="#ecebeb"
                    >
                        <rect x="0" y="0" rx="5" ry="5" width="400" height="20" />
                        <rect x="0" y="40" rx="5" ry="5" width="400" height="20" />
                        <rect x="0" y="80" rx="5" ry="5" width="400" height="20" />
                        <rect x="0" y="120" rx="5" ry="5" width="400" height="20" />
                    </ContentLoader>
                ) : comment === 'deleted' ? (
                    <p className="text-center">Comment has been deleted.</p>
                ) : (
                    <div className="flex flex-col items-center">
                        <p className="bg-gray-100 p-4 rounded w-full text-center text-blue-600">{comment.content}</p>
                        <p className="bg-gray-200 p-2 rounded w-full text-center text-gray-700">Author: {comment.author?.username}</p>
                        {comment.author?._id === userId || comment.post?.author?._id === userId ? (
                            <>
                                <button 
                                    onClick={handleEdit} 
                                    className="bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded mb-2 w-full mt-2"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={handleDelete} 
                                    className="bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded mb-2 w-full"
                                >
                                    Delete
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={handleDelete} 
                                className="bg-gray-200 hover:bg-gray-300 text-black py-2 px-4 rounded mb-2 w-full mt-2"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
