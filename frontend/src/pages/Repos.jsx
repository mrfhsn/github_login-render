import React, { useEffect, useState } from 'react'
// import axios from 'axios'
import api from '../config/axiosConfig'

const Repos = ({ user }) => {

    // const [repo, setRepo] = useState({});
    const [repo, setRepo] = useState(null);

    // const api = axios.create({
    //     baseURL: import.meta.env.VITE_BASE_API,
    //     withCredentials: true
    // });

    // console.log(user);

    useEffect(() => {
        async function getRepos() {
            try {
                console.log(user.user_id);
                const repos = await api.post(`/repos/${user.user_id}`);
                setRepo(repos);
                console.log(repo);

            } catch (error) {
                console.log("Error fetching Repo data:", error);
            }
        }

        getRepos();

    }, []);

    return (
        <>
            {/* <p>{repo}</p> */}
            <h1>Hello</h1>
        </>
    )
}

export default Repos