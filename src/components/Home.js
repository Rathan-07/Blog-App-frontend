import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Use the AuthContext to get the user state

  const handleRegisterClick = () => {
    if (!user.isLoggedIn) {
      navigate('/register');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Main Section */}
      <main
        className="flex-grow flex flex-col items-center justify-center bg-cover bg-center mt-16" // Added margin-top to avoid touching header
        style={{ backgroundImage: `url(https://media.istockphoto.com/id/1146554418/photo/retro-blog-bookshelf-with-cozy-interior.jpg?s=2048x2048&w=is&k=20&c=p0XIBaxLUewH7JT3ECbCW-uf34jr_hEnzco7rCUwbcg=)` }}
      >
        <div className="bg-black bg-opacity-50 p-10 rounded-lg text-center text-white max-w-2xl">
          <h1 className="text-5xl font-bold mb-4">Let the Games Begin</h1>
          <p className="text-lg mb-8">
            Where "Are we there yet?" doesn't exist and there's no stifling your imagination—no matter how old you are. What are you waiting for? It's your move!
          </p>
          <button
            onClick={handleRegisterClick}
            disabled={user.isLoggedIn}
            className={`px-6 py-2 font-bold text-white rounded ${user.isLoggedIn ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {user.isLoggedIn ? 'Registered' : 'Register Now'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Home;
