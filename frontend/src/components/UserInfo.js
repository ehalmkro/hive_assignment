import React from 'react';
import {useParams} from 'react-router-dom'
import {useState, useEffect} from 'react'
import {getUserData} from '../services/evaluations'
const UserInfo = () => {
    const [userData, setUserData] = useState({})
    const fetchUserData = async (id) => {
        const data = await getUserData(id)
        setUserData(data);
    }
    const { id } = useParams()
    const {total} = userData;

    useEffect(() => {
        fetchUserData(id);
    }, [total])

    return (
    <div>tere {id}</div>
)}
export default UserInfo;