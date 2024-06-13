import { useEffect, useState } from "react";
import axios from "../config/axios";
import { Link } from "react-router-dom";
import CommentForm from "./comment/CommentForm";
import CommentList from "./comment/CommentList";


export default function PostList() {
    const [posts, setPosts] = useState([]);
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState(null);
    

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/api/posts');
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('/api/users/profile', {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                setUserId(response.data._id); // Assuming the profile data contains an _id field
                setUser(response.data.username); // Assuming the profile data contains a username field
            } catch (error) {
                console.log(error);
            }
        };

        fetchUserProfile();
    }, []);

    const handlePostDelete = (postId) => {
        setPosts(posts.filter(post => post._id !== postId));
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-8">Blogs</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {posts.map((post) => (
                    <PostItem 
                        key={post._id} 
                        post={post} 
                        userId={userId} 
                        username={user}
                        onDelete={handlePostDelete} 
                    />
                ))}
            </div>
        </div>
    );
}

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
                await axios.delete(`/posts/${postId}`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                });
                onDelete(postId); // Notify PostList to remove the deleted post from the state
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
                <h3 className="text-xl font-bold mb-2"><a href="#">{post.title}</a></h3>
                <div className="mb-4">
                    <h3>Title: <span dangerouslySetInnerHTML={{ __html: post.title }} /></h3>
                    <h3>Content:</h3>
                    <div className="overflow-auto max-h-96">
                        <div dangerouslySetInnerHTML={{ __html: isReadMore ? post.content : post.content.substring(0, 100) + '...' }} />
                        <button onClick={toggleReadMore} className="text-blue-500 mt-2">
                            {isReadMore ? "Read Less" : "Read More"}
                        </button>
                    </div>
                    {post.featuredImage && (
                        <img src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover rounded-md mb-4" />
                    )}
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
                        <button className="text-red-600" onClick={() => handleDelete(post._id)}>Delete</button>
                    </div>
                )}
            </div>
            <CommentForm postId={post._id} refreshComments={fetchComments} />
            <CommentList postId={post._id} comments={comments} />
        </div>
    );
}
