import { useState } from "react";
import axios from "../../config/axios";

export default function CommentForm({ postId, refreshComments }) {
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const commentData = { content };
        try {
           const response = await axios.post(`/api/posts/${postId}/comments`, commentData, {
                headers: { Authorization: localStorage.getItem('token') }
            });
            setContent('');
            refreshComments();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="mt-4">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <input
                    type="text"
                    id="content"
                    name="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 md:w-auto border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 md:w-auto">
                    Post
                </button>
            </form>
        </div>
    );
}
