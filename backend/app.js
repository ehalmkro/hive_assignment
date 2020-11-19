import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import {getToken, fetchAllFromAPI} from './utils/utilities.js'
import _ from 'lodash'


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json())

const evaluationController = express.Router()


evaluationController.get('/', async (request, response, next) => {
    response.status(200).json(evaluationList);
})


const now = new Date();
const dayAgo = new Date();
dayAgo.setDate(now.getDate() - 1);           // TODO: replace w/ user defined time
console.log('now it is', now, 'a day ago it was', dayAgo)


const {access_token, expires_in} = await getToken()
console.log(access_token, expires_in)

//const userList = await fetchAllFromAPI('/campus/13/users/', access_token)
//console.log(userList.length, 'users at Hive Helsinki')

await new Promise(r => setTimeout(r, 1000)); // Sleep to not go over rate limit...

const evaluationList = await fetchAllFromAPI(`/scale_teams?range[filled_at]=${dayAgo.toISOString()},${now.toISOString()}`, access_token)
console.log('before', evaluationList.length)

_.remove(evaluationList, (evaluation) => {
    const filledAt = Date.parse(evaluation.filled_at)
    const beginAt = Date.parse(evaluation.begin_at)
    return ((filledAt - beginAt) / 1000 / 60) > 15
})
console.log('after', evaluationList.length)

app.use('/api/evaluations', evaluationController)


export default app;