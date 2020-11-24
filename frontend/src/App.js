import {BrowserRouter as Router, Route, Link, Switch, useParams} from "react-router-dom";
import Dashboard from "./components/Dashboard"
import UserInfo from "./components/UserInfo"
import React, { useEffect } from 'react'
import {useDispatch, useSelector} from "react-redux";

import {initReducer} from "./services/reducer";

const App = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initReducer())
    }, [dispatch])

    const {evaluations, stats, users, currentPage} = useSelector(state => state)
    return (
        <Router>
            <div>
                <nav>
                    <Link to='/'>Hive</Link>
                </nav>
            </div>
            <Switch>
                <Route path='/user/:id'>
                    <UserInfo />
                </Route>
                <Route path="/">
                    {evaluations && <Dashboard stats={stats} evaluations={evaluations} currentPage={currentPage}/>}
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
