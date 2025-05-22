import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';

const Navbar = ({ user, setUser }) => {
  // const navigate = useNavigate();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">

        <Link to="/" className="text-white font-bold">
          GitHub OAuth App
        </Link>

        {user && Object.keys(user).length > 0 ? (
          <LogoutButton user={user} setUser={setUser} />
        ) : null}

      </div>
    </nav>
  );
};

export default Navbar;