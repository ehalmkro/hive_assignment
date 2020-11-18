import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import getToken from './utils/getToken.js'


dotenv.config();

const app = express();
app.use(cors());

const evaluationController = express.Router()


evaluationController.get('/', async (request, response, next) => {

})

app.use('/api/evaluations', evaluationController)


const token = await getToken()
console.log(token)




export default app;