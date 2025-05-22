import React from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import api from '../config/axiosConfig'

// function LogoutButton() {
function LogoutButton({ user, setUser }) {

    const navigate = useNavigate();

    // const api = axios.create({
    //     baseURL: import.meta.env.VITE_BASE_API || '/api',
    //     withCredentials: true,
    // });

    const logout = async () => {
        try {
            await api.post('/logout');
            setUser(null);  // Clear the user state
            // setUser({});  // Clear the user state
            navigate('/login');  // Redirect to login
        } catch (error) {
            console.log('Logout failed: ' + (error.response?.data?.error || 'Unknown error'));
        }
    };


    return (

        <button className='px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75' onClick={logout}>Log Out
        </button>
    );
}

export default LogoutButton;