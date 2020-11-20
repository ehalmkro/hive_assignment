import express from 'express';
import {fetchAllFromAPI, getToken} from "./apiUtils.js";
import {parseEvaluations, applyGoodnessScale} from './parseUtils.js'

const evaluationController = express.Router()

const now = new Date();
const dayAgo = new Date();
dayAgo.setDate(now.getDate() - 1);           // hard coded amount of days TODO: replace w/ user defined time
console.log('now it is', now, 'a day ago it was', dayAgo)


const {access_token, expires_in} = await getToken()
console.log(access_token, expires_in)

await new Promise(r => setTimeout(r, 1000)); // Sleep to not go over rate limit...

const evaluationList = await fetchAllFromAPI(
    `/scale_teams?range[filled_at]=${dayAgo.toISOString()},${now.toISOString()}`, access_token)

const {shortEvaluations, shortFeedbackEvaluations, lowRatingEvaluations} = parseEvaluations(evaluationList)

const evaluationListWithGoodness = applyGoodnessScale(evaluationList)

evaluationController.get('/', async (request, response, next) => {
    response.status(200).json({
        totalEvaluations: evaluationList.length,
        shortEvaluations: shortEvaluations.length,
        shortFeedbackEvaluations: shortFeedbackEvaluations.length,
        lowRating: lowRatingEvaluations.length,
    });
})

export default evaluationController;