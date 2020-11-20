import cors from 'cors';
import express from 'express';

import evaluationController from "./utils/evaluationController.js";


const app = express();
app.use(cors());
app.use(express.json())
app.use('/api/evaluations', evaluationController)


export default app;