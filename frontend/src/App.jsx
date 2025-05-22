import React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import api from './config/axiosConfig'

import Login from './pages/Login';
import Profile from './pages/Profile';
// import Repos from './pages/Repos';
import Navbar from './components/Navbar';


export default function App() {

  // const [user, setUser] = useState({});
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();  // Track the location (i.e. route)

  // console.log(user, navigate, location);

  // const api = axios.create({
  //   baseURL: import.meta.env.VITE_BASE_API || '/api',
  //   withCredentials: true,
  // });

  // Fetch user data every time the route changes
  useEffect(() => {
    async function fetchData() {
      // console.log(user, navigate, location);
      // console.log(user);
      // console.log(navigate, location);
      try {
        // const response = await api.get('/protected');
        // const response = await api.get('/api/auth/user');
        const response = await api.get('/auth/user');
        // console.log('response.data.user: ' + response.data.user);
        setUser(response.data.user); // Update state with the fetched data

      } catch (error) {
        // console.log("Error fetching user data:", error);

        // Avoid infinite loop by checking if we're already on the login page
        // if (location.pathname !== '/login' && user !== null) {
        if (location.pathname !== '/login' && (!user || Object.keys(user).length === 0)) {
          navigate('/login');
        }
      }
    }

    fetchData();
    // }, [location, user, navigate]);  // Watch for changes in location or user state
  }, [location, navigate]);  // Watch for changes in location

  // user in the Dependency Array

  // setUser(response.data.user) updates the user state.
  // Because user is in the dependency array, this triggers useEffect again.
  // This results in an infinite loop of fetch → update state → trigger effect → fetch again.'

  const isUserAuthenticated = user && Object.keys(user).length > 0;

  return (
    <>
      <Navbar user={user} setUser={setUser} />
      <Routes>

        <Route path="/" element={<Navigate to="/login" />} />

        {/* <Route path="/login" element={!user ? <Login /> : <Navigate to="/profile" />} /> */}
        <Route
          path="/login"
          element={!isUserAuthenticated ? <Login /> : <Navigate to="/profile" />}
        />


        {/* <Route path="/auth-callback" element={<AuthCallback setUser={setUser} />} /> */}

        {/* <Route
          path="/profile"
          element={user ? <Profile user={user} /> : <Navigate to="/login" />}
        /> */}
        <Route
          path="/profile"
          element={isUserAuthenticated ? <Profile user={user} /> : <Navigate to="/login" />}
        />

        {/* <Route
          path="/repos"
          element={isUserAuthenticated ? <Repos user={user} /> : <Navigate to="/login" />}
        /> */}

      </Routes>
    </>
  );
};