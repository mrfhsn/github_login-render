import React, { useState } from 'react'
// import axios from 'axios'
import api from '../config/axiosConfig'
// const api = require('../config/axiosConfig');

function RepoList({ repos }) {
    // console.log(repos);
    const REPOS = repos;
    // console.log(REPO.repo.total_count)

    const count = REPOS.repo.total_count;
    const list = REPOS.repo.items.map((r) => [r.name, r.private]);
    // console.log(list);

    return (
        <div>
            <h3>Repositories: {count}</h3>

            <ul className='bg-slate-200 p-2 border rounded-sm'>
                {list.map((r, index) => (
                    <li key={index}>
                        {r[0]} - {r[1] ? "Private" : "Public" }
                    </li>
                ))}
            </ul>

        </div>
    );
}

function Repobutton({ user }) {
    const [repos, setRepos] = useState(null);

    // const api = axios.create({
    //     baseURL: import.meta.env.VITE_BASE_API,
    //     withCredentials: true
    // });

    const getRepos = async () => {
        try {
            // console.log(user.user_id);
            const repos = await api.get(`/repos/${user.user_id}`);

            // console.log(repos);
            setRepos(repos.data);

        } catch (error) {
            console.log("Error fetching Repo data:", error);
        }
    }

    return (
        <div>
            <button className='bg-black text-white border rounded-md p-1 w-full mt-4 mx-auto cursor-pointer' onClick={getRepos}>Show Repos</button>
            {repos && <RepoList repos={repos} />}
        </div>
    )
}

export default Repobutton;
