import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import { getToken, requestAPI } from './utils/utilities.js'


dotenv.config();

const app = express();
app.use(cors());

const evaluationController = express.Router()


evaluationController.get('/', async (request, response, next) => {

})

app.use('/api/evaluations', evaluationController)


const { access_token, expires_in }  = await getToken()
console.log(access_token, expires_in)

const response = await requestAPI('/cursus/42/users', access_token);
console.log(response)

export default app;