import express from 'express';
import {fetchAllFromAPI, getToken} from "../utils/apiUtils.js";
import {getTimeRange} from "../utils/utils.js";
import {
    parseEvaluationStats,
    applyGoodnessScale,
    paginateItems,
    filterByCorrectorId
} from '../utils/parseUtils.js'
import dbUtils from "./evaluationModel.js";

const evaluationController = express.Router()

const {access_token, expires_in} = await getToken()
console.log(access_token, expires_in)
const dateRange = getTimeRange(4)
const campus_id = 13; //hive helsinki

const db = await dbUtils.openDb()

if ((await dbUtils.countAll(db, 'scale_teams')).COUNT === 0) {
    console.log(`fetching evals from ${dateRange.min} to ${dateRange.max}...`)
    await dbUtils.save(
        db, applyGoodnessScale(
            await fetchAllFromAPI(
                `/scale_teams?range[filled_at]=${dateRange.min.toISOString()},${dateRange.max.toISOString()}`, access_token)), 'scale_teams')
}
if ((await dbUtils.countAll(db, 'users')).COUNT === 0) {
    console.log(`fetching users from campus #${campus_id}...`)
    await dbUtils.save(db,
        await fetchAllFromAPI(`/campus/${campus_id}/users`, access_token),
        'users')
}

const evaluationList = await dbUtils.getAllJSON(db, 'scale_teams')
const userList = await dbUtils.getAllJSON(db, 'users')

evaluationController.get('/stats', async (request, response, next) => {
    return response.status(200).json(parseEvaluationStats(evaluationList));
})

evaluationController.get('/stats/:id', async (request, response, next) => {
    const {id} = request.params
    const filteredItems = filterByCorrectorId(await dbUtils.getAllJSON(db, 'scale_teams'), id)
    return response.status(200).json({...parseEvaluationStats(filteredItems), data: filteredItems})
})

evaluationController.get('/', async (request, response, next) => {
    const {page, per_page} = request.query;
    return response.status(200).json(paginateItems(evaluationList, page, per_page))
})

evaluationController.get('/users', async (request, response, next) => {
    const {page, per_page} = request.query;
    return response.status(200).json({...paginateItems(userList, page, per_page), campus_id: campus_id})
})


export default evaluationController;