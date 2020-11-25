import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";
import Dashboard from "./components/Dashboard"
import UserInfo from "./components/UserInfo"
import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";

import {initReducer, changePageTo} from "./services/reducer";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import StatTable from "./components/StatTable";

const App = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initReducer())
    }, [dispatch])

    const {evaluations, stats, currentPage} = useSelector(state => state)
    return (
        <Router>
            <AppBar position="static" color="default">
                <nav>
                    <Button variant="contained" color="default" component={Link} to="/" onClick={() => dispatch(changePageTo(1))}>Home</Button>
                    <Button variant="contained" color="default" component={Link} to="/stats">Evaluation stats</Button>
                </nav>
            </AppBar>
            <Switch>
                <Route path='/user/:id'>
                    <UserInfo/>
                </Route>
                <Route path="/stats">
                    <>
                        <h1>Evaluation statistics</h1>
                        {stats && <> <h2>All of 42 </h2> <StatTable stats={stats}/> </>}
                        {evaluations && <> <h2>Hive </h2> <StatTable stats={evaluations}/> </>}
                    </>
                </Route>
                <Route path="/">
                    <h1>Recent evaluations at Hive</h1>
                    {evaluations && <Dashboard stats={stats} evaluations={evaluations} currentPage={currentPage}/>}
                </Route>

            </Switch>
        </Router>
    );
}

export default App;
