import React from 'react';
import {useParams} from 'react-router-dom'
import {useState, useEffect} from 'react'
import {getUserData} from '../services/evaluations'
import EvalTable from "./EvalTable";
import Button from "@material-ui/core/Button";
import {Link} from 'react-router-dom'
import Typography from '@material-ui/core/Typography';

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

    if (!Object.keys(userData).length)
        return null;
    return (
        <>
        <Typography variant="h2"> {userData.data[0].corrector.login} </Typography>
        <Typography> Average evaluation "quality" {(userData.averageGoodness * 100).toFixed(2)} % </Typography>
            <EvalTable evaluations={userData.data}/>

            <Button variant="contained" component={Link} to="/" color="primary">
                Go back
            </Button>
        </>
    )
}
export default UserInfo;