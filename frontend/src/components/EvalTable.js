import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import React from "react";
import { Link } from 'react-router-dom'

const dateDifference = (first, second) => {
    let diff = new Date(second) - new Date(first);
    return (`${Math.round(diff/60000)} minutes`)
}

const EvalTable = ({evaluations}) => {
if (!evaluations)
    return null;
return (
<Table size='small'>
    <TableHead>
        <TableRow>
            <TableCell>Started at</TableCell>
            <TableCell>Evaluator</TableCell>
            <TableCell>Evaluation quality</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Project final grade</TableCell>
        </TableRow>
    </TableHead>
    <TableBody>
        {evaluations.map(row => {
            return (
                <TableRow key={row.id}>
                    <TableCell>{((new Date(row.begin_at)).toLocaleString("en-FI"))}</TableCell>
                    <TableCell><Link to={`/user/${row.corrector.id}`}>{row.corrector.login}</Link></TableCell>
                    <TableCell>{row.evalGoodness * 100 + '%'}</TableCell>
                    <TableCell>{dateDifference(row.begin_at, row.filled_at)}</TableCell>
                    <TableCell>{row.final_mark}</TableCell>
                </TableRow>
            )}
        )}
    </TableBody>
</Table>
)}

export default EvalTable