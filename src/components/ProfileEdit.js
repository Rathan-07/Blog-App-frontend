import { useState } from "react";
import axios from "../components/config/axios";
import { useAuth } from "../components/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfileEdit({ setIsEdit }) {
    const { user, dispatch } = useAuth();
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        username: user.account.username,
        email: user.account.email,
        bio: user.account.bio,
    });
    const navigate = useNavigate();

    const submitImage = async (e) => {
        e.preventDefault();
        try {
            const imageData = new FormData();
            imageData.append("profilePicture", image);

            const result = await axios.post("/api/users/upload-profile-picture", imageData, {
                headers: { Authorization: localStorage.getItem("token"), "Content-Type": "multipart/form-data" },
            });
            console.log(result, "result");
            dispatch({ type: "LOGIN", payload: { account: result.data.user } });
            setImage(null);
        } catch (err) {
            console.error(err);
        }
    };

    const onImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const submitForm = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = await axios.put(`/api/users/profile`, formData, {
                headers: { Authorization: localStorage.getItem("token") },
            });
            dispatch({ type: "LOGIN", payload: { account: updatedUser.data } });
            navigate("/account");
            setIsEdit(false);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <h3 className="text-2xl font-bold mb-4">Edit User</h3>
            {user.account?.profilePicture && (
                <img
                    src={`http://localhost:3334/${user.account.profilePicture}`}
                    alt="Profile"
                    className="w-40 h-40 object-cover rounded-full"
                />
            )}
            <form onSubmit={submitImage} className="mb-4">
                <input type="file" accept="image/*" onChange={onImageChange} className="mt-2" />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">
                    Submit
                </button>
            </form>

            <form onSubmit={submitForm} className="space-y-4">
                <div className="mb-4">
                    <label className="block">
                        <span className="text-gray-700">Username:</span>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={onInputChange}
                            className="form-input mt-1 block w-full rounded-md border-gray-300"
                        />
                    </label>
                </div>
                <div className="mb-4">
                    <label className="block">
                        <span className="text-gray-700">Email:</span>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={onInputChange}
                            className="form-input mt-1 block w-full rounded-md border-gray-300"
                        />
                    </label>
                </div>
                <div className="mb-4">
                    <label className="block">
                        <span className="text-gray-700">Bio:</span>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={onInputChange}
                            className="form-textarea mt-1 block w-full rounded-md border-gray-300"
                        ></textarea>
                    </label>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Submit
                </button>
            </form>
        </>
    );
}
