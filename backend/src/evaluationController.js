import express from 'express';
import {fetchAllFromAPI, getToken} from "../utils/apiUtils.js";
import {parseEvaluations, applyGoodnessScale, goodnessCount} from '../utils/parseUtils.js'
import dbUtils from "./evaluationModel.js";



const evaluationController = express.Router()

const now = new Date();
const dayAgo = new Date();
dayAgo.setDate(now.getDate() - 1);           // hard coded amount of days TODO: replace w/ user defined time
console.log('now it is', now, 'a day ago it was', dayAgo)


const {access_token, expires_in} = await getToken()
console.log(access_token, expires_in)


const db = await dbUtils.openDb()
await dbUtils.init(db);

let evaluationList;
if ((await dbUtils.countAll(db)).COUNT === 0) {
    evaluationList = await fetchAllFromAPI(
        `/scale_teams?range[filled_at]=${dayAgo.toISOString()},${now.toISOString()}`, access_token)
    await dbUtils.save(db, applyGoodnessScale(evaluationList))
}
else
    evaluationList = await dbUtils.getJSON(db)


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