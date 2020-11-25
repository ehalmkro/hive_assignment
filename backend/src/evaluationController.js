import express from 'express';
import {getToken} from "../utils/apiUtils.js";
import {getTimeRange} from "../utils/utils.js";
import {
    parseEvaluationStats,
    paginateItems,
    filterByCorrectorId, filterByUserList, sortBy
} from '../utils/parseUtils.js'
import dbUtils from "./evaluationModel.js";
import {updateDb, parseHours} from "../utils/utils.js";

const evaluationController = express.Router()


const {access_token, expires_in} = await getToken()
console.log(access_token, expires_in)


const dateRange = getTimeRange(parseHours())
const campus_id = 13; //hive helsinki
const db = await dbUtils.openDb()
await updateDb(db, access_token, dateRange, campus_id)

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

evaluationController.get('/per_campus', async (request, response, next) => {
    const {page, per_page, sort} = request.query;
    let filteredItems = filterByUserList(evaluationList, userList);
    filteredItems = sort ? sortBy(filteredItems, sort) : filteredItems;
    return response.status(200).json({ ...parseEvaluationStats(filteredItems), ...paginateItems(filteredItems, page, per_page)})
})

evaluationController.get('/users', async (request, response, next) => {
    const {page, per_page} = request.query;
    return response.status(200).json({ campus_id: campus_id, ...paginateItems(userList, page, per_page)})
})


export default evaluationController;