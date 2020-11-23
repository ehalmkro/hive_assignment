import express from 'express';
import { getToken } from "../utils/apiUtils.js";
import {getTimeRange} from "../utils/utils.js";
import {parseEvaluations, applyGoodnessScale, goodnessCount} from '../utils/parseUtils.js'
import dbUtils from "./evaluationModel.js";



const evaluationController = express.Router()


const {access_token, expires_in} = await getToken()
console.log(access_token, expires_in)


const db = await dbUtils.openDb()
const evaluationList = await dbUtils.init(db, getTimeRange(2), access_token);



const {shortEvaluations, shortFeedbackEvaluations, lowRatingEvaluations} = parseEvaluations(evaluationList)

const goodnessDistribution = goodnessCount(evaluationList)

evaluationController.get('/stats', async (request, response, next) => {
    response.status(200).json({
        totalEvaluations: evaluationList.length,
        shortEvaluations: shortEvaluations.length,
        shortFeedbackEvaluations: shortFeedbackEvaluations.length,
        lowRating: lowRatingEvaluations.length,
        goodnessDistribution: goodnessDistribution
    });
})

export default evaluationController;