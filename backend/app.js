import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import { getToken, fetchAllFromAPI } from './utils/utilities.js'
//import { remove } from lodash


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json())

const evaluationController = express.Router()


evaluationController.get('/', async (request, response, next) => {
    response.status(200).json(userList);
})


const now = new Date();
const dayAgo = new Date();
dayAgo.setDate(now.getDate()-1);           // TODO: replace w/ user defined time
console.log('now it is', now, 'a week ago it was', dayAgo)


const { access_token, expires_in }  = await getToken()
console.log(access_token, expires_in)

const userList = await fetchAllFromAPI('/campus/13/users/', access_token)
console.log(userList.length, 'users at Hive Helsinki')

await new Promise(r => setTimeout(r, 1000)); // Sleep to not go over rate limit...

//const evaluationList = await fetchAllFromAPI('/scale_teams/', access_token, {range: {filled_at: `${weekAgo.toISOString()},${now.toISOString()}`}})

const evaluationList = await fetchAllFromAPI(`/scale_teams?range[filled_at]=${dayAgo.toISOString()},${now.toISOString()}`, access_token)
console.log(evaluationList)


//const cursusList = await fetchAllFromAPI('/cursus/1/users', access_token)
//console.log(cursusList.length, '42 cursus students')



app.use('/api/evaluations', evaluationController)


export default app;