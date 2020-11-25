import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';



const StackedBar = ({data}) => {
    const sum = Object.keys(data).reduce((sum,key)=>sum+parseFloat(data[key]||0),0);

    const graphData = [
        {name: 'great', amount: data['1'], percentage: data['1'] ? (data['1'] / sum * 100).toPrecision(2)  : 0},
        {name: 'ok', amount: data['0.67'], percentage: data['0.67'] ? (data['0.67'] / sum * 100).toPrecision(2) : 0},
        {name: 'fair', amount: data['0.33'], percentage: data['0.33'] ? (data['0.33'] / sum * 100).toPrecision(2) : 0},
        {name: 'poor', amount: data['0'], percentage: data['0'] ? (data['0'] / sum * 100).toPrecision(2) : 0}]
        return (
            <BarChart
                width={500}
                height={300}
                data={graphData}
                margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                }}
            >
              <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="percentage" stackId="a" fill="#8884d8" />
            </BarChart>
        );
}

export default StackedBar
