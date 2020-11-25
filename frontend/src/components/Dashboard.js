import React from 'react';
import Button from '@material-ui/core/Button'
import {useDispatch} from "react-redux";
import {changePageTo} from '../services/reducer'
import EvalTable from "./EvalTable";


const Dashboard = ({stats, evaluations, currentPage}) => {
    const dispatch = useDispatch();
    if (!evaluations) return null;
    return (
        <div>
            there's a total of {stats.total} evals from the last week, {evaluations.total} from Hive
            <EvalTable evaluations={evaluations.data} />

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