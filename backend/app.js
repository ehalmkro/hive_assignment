import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import { getToken, getAllCampusUsers } from './utils/utilities.js'


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json())

const evaluationController = express.Router()


evaluationController.get('/', async (request, response, next) => {

})

app.use('/api/evaluations', evaluationController)


const { access_token, expires_in }  = await getToken()
console.log(access_token, expires_in)

const userList = await getAllCampusUsers(13, access_token)
console.log(userList.length, 'users')


export default app;