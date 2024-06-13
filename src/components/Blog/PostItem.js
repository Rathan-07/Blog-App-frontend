import { useState, useEffect } from "react";
import axios from "../config/axios";
import { Link } from "react-router-dom";
import CommentForm from "./comment/CommentForm";
import CommentList from "./comment/CommentList";

function PostItem({ post, userId, username, onDelete }) {
    const [comments, setComments] = useState([]);
    const [isReadMore, setIsReadMore] = useState(false);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`/api/posts/${post._id}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [post._id]);

    const handleDelete = async (postId) => {
        try {
            const userConfirm = window.confirm("Are you sure?");
            if (userConfirm) {
                await axios.delete(`/api/posts/${postId}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                onDelete(postId);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6 mb-6 flex flex-col justify-between">
            <div>
                <h3 className="text-xl font-bold mb-2"><a href={`/api/posts/${post._id}`}>{post.title}</a></h3>
                <p className="text-gray-600 mb-4">Author - {post.author}</p>
                {post.featuredImage && (
                    <img src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover rounded-md mb-4" />
                )}
                <div className="mb-4">
                    <div dangerouslySetInnerHTML={{ __html: isReadMore ? post.content : post.content.substring(0, 100) + '...' }} />
                    <button onClick={toggleReadMore} className="text-blue-500 mt-2">
                        {isReadMore ? "Read Less" : "Read More"}
                    </button>
                </div>
            </div>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                    <img className="w-8 h-8 rounded-full" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png" alt="Author Avatar" />
                    <span className="text-sm font-medium">{username}</span>
                </div>
                {post.author === userId && (
                    <div>
                        <button className="text-blue-500 mr-2"><Link to={`/api/posts/${post._id}`}>Edit</Link></button>
                        <button className="text-red-500" onClick={() => handleDelete(post._id)}>Delete</button>
                    </div>
                )}
            </div>
            <CommentForm postId={post._id} refreshComments={fetchComments} />
            <CommentList postId={post._id} comments={comments} />
        </div>
    );
}

export default PostItem;
