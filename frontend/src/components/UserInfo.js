import React from 'react';
import {useParams} from 'react-router-dom'
import {useState, useEffect} from 'react'
import {getUserData} from '../services/evaluations'
import EvalTable from "./EvalTable";
import Button from "@material-ui/core/Button";
import {Link} from 'react-router-dom'

const UserInfo = () => {
    const [userData, setUserData] = useState({})
    const fetchUserData = async (id) => {
        const data = await getUserData(id)
        setUserData(data);
    }
    const {id} = useParams()

    useEffect(() => {
        fetchUserData(id);
    }, [id])

    return (
        <>
            <EvalTable evaluations={userData.data}/>
            <Button variant="contained" component={Link} to="/" color="primary">
                Go back
            </Button>
        </>
    )
}
export default UserInfo;