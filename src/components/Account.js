import { useAuth } from "../components/context/AuthContext";
import { useState } from "react";
import ProfileEdit from "./ProfileEdit";
import backgroundImage from "../components/images/bg3.jpg"; // Import the background image

export default function Profile() {
    const { user } = useAuth();
    const [isEdit, setIsEdit] = useState(false);

    return (
        <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Account Info</h2>
                {user.isLoggedIn ? (
                    !isEdit ? (
                        <div className="flex flex-col items-center space-y-4">
                            {user.account?.profilePicture && (
                                <img
                                    src={`http://localhost:3334/${user.account.profilePicture}`}
                                    alt="Profile"
                                    className="rounded-full w-40 h-40 object-cover"
                                />
                            )}
                            <p className="text-lg"><strong className="font-semibold">Username:</strong> {user.account.username}</p>
                            <p className="text-lg"><strong className="font-semibold">Email:</strong> {user.account.email}</p>
                            <p className="text-lg"><strong className="font-semibold">Bio:</strong> {user.account.bio}</p>
                            <button
                                onClick={() => setIsEdit(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
                            >
                                Edit Profile
                            </button>
                        </div>
                    ) : (
                        <ProfileEdit setIsEdit={setIsEdit} />
                    )
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}
