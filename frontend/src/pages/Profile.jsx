import React from 'react';
import { useEffect, useState } from 'react';
import Repobutton from '../components/Repobutton';

const Profile = ({ user }) => {
  // console.log(user);

  // 

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <img
          src={user.avatar_url}
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto"
        />
        <h2 className="text-2xl font-bold text-center mt-4">{user.name}</h2>
        <p className="text-gray-600 text-center">{user.email}</p>
        <div className="mt-6">
          <h3 className="font-bold">GitHub Info:</h3>
          <p>Username: {user.gh_username}</p>
          {/* <p>ID: {user.github_id}</p> */}
          <p>ID: {user.user_id}</p>
          {/* <p>URL: https://github.com/{user.gh_username}</p> */}
          <p>
            URL: <a href={`https://github.com/${user.gh_username}`} target="_blank" rel="noopener noreferrer" className='text-blue-600'>https://github.com/{user.gh_username}</a>
          </p>

          {/* <p>Public Repos: {user.public_repos}</p> */}
          <Repobutton user={user} />
          

        </div>
      </div>
    </div>
  );

};

export default Profile;