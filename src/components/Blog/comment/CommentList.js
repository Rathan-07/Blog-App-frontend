import { Link } from "react-router-dom";

export default function CommentList({ comments, postId }) {
    return (
        <div className="mt-4 h-40 overflow-y-auto">
            <h4 className="text-lg font-semibold mb-2">Comments</h4>
            {comments && comments.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                    {comments.map((comment) => (
                        <li key={comment._id} className="py-2">
                            <Link to={`/api/posts/${postId}/comments/${comment._id}`} className="text-blue-500 hover:underline">
                                {comment?.author?.username} - {comment.content}
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No comments available.</p>
            )}
        </div>
    );
}
