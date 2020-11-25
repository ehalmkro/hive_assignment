import React from 'react';
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import StackedBar from "./StackedBar";

const StatTable = ({stats}) => {
    if (!Object.keys(stats).length)
        return null;
    return (
        <>
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>Total evaluations</TableCell>
                        <TableCell>Average evaluation "quality"</TableCell>
                        <TableCell>Short eval sessions</TableCell>
                        <TableCell>Short evaluator feedback</TableCell>
                        <TableCell>Low rated evaluations</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow key="42">
                        <TableCell>{stats.total}</TableCell>
                        <TableCell>{(stats.averageGoodness.toPrecision(2))}</TableCell>
                        <TableCell>{stats.shortEvaluations}</TableCell>
                        <TableCell>{stats.shortFeedbackEvaluations}</TableCell>
                        <TableCell>{stats.lowRatingEvaluations}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <h3>Eval "quality" distribution</h3>
         <StackedBar data={stats.goodnessDistribution}/>
        </>
    )
}


export default StatTable