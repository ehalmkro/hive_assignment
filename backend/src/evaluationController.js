import express from 'express';
import {fetchAllFromAPI, getToken} from "../utils/apiUtils.js";
import {getTimeRange} from "../utils/utils.js";
import {parseEvaluations, goodnessCount, applyGoodnessScale, paginateItems} from '../utils/parseUtils.js'
import dbUtils from "./evaluationModel.js";



const evaluationController = express.Router()


const {access_token, expires_in} = await getToken()
console.log(access_token, expires_in)
const dateRange = getTimeRange(4)

const db = await dbUtils.openDb()
console.log((await dbUtils.countAll(db)).COUNT)
if ((await dbUtils.countAll(db)).COUNT === 0) {
    await dbUtils.save(
        db, applyGoodnessScale(
            await fetchAllFromAPI(
                `/scale_teams?range[filled_at]=${dateRange.min.toISOString()},${dateRange.max.toISOString()}`, access_token)))
}

const evaluationList = await dbUtils.getAllJSON(db)

evaluationController.get('/stats', async (request, response, next) => {

    const {shortEvaluations, shortFeedbackEvaluations, lowRatingEvaluations} = parseEvaluations(evaluationList)
    const goodnessDistribution = goodnessCount(evaluationList)

    return response.status(200).json({
        totalEvaluations: evaluationList.length,
        shortEvaluations: shortEvaluations.length,
        shortFeedbackEvaluations: shortFeedbackEvaluations.length,
        lowRating: lowRatingEvaluations.length,
        goodnessDistribution: goodnessDistribution
    });
})

evaluationController.get('/', async (request, response, next) => {
    const { page, per_page} = request.query;
    const evaluationList = await dbUtils.getAllJSON(db)
    response.status(200).json(paginateItems(evaluationList, page, per_page))
})

export default evaluationController;