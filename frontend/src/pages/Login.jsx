import React from 'react';

const Login = () => {

  const handleGithubLogin = () => {
    // window.location.href = 'http://localhost:5000/api/auth/github';
    const URL = import.meta.env.VITE_BASE_API;
    // window.location.href = `${URL}/api/auth/github`;
    window.location.href = `${URL}/auth/github`;
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button
        onClick={handleGithubLogin}
        className="bg-gray-900 text-white px-6 py-3 rounded-lg flex items-center"
      >
        Login with GitHub
      </button>
    </div>
  );
};

export default Login;