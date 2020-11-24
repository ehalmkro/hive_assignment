import React from 'react';
import RecentEvals from "./RecentEvals";
import Button from '@material-ui/core/Button'
import {useDispatch} from "react-redux";
import {changePageTo} from '../services/reducer'


const Dashboard = ({stats, evaluations, currentPage}) => {
    const dispatch = useDispatch();
    if (!evaluations) return null;
    console.log(evaluations.last_page)
    return (
        <div>
            there's a total of {stats.total} evals from the last week, {evaluations.total} from Hive
            <RecentEvals evaluations={evaluations.data}/>


            {currentPage > 1
                ? <Button variant="contained" color="primary" onClick={() => dispatch(changePageTo(currentPage - 1))}>Previous page</Button>
                : null}

            {currentPage < evaluations.last_page
                ? <Button variant="contained" color="primary" onClick={() => dispatch(changePageTo(currentPage + 1))}>Next page</Button>
                : null}

        </div>
    )
}


export default Dashboard;