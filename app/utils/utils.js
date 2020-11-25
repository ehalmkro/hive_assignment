import dbUtils from "../src/evaluationModel.js";
import {applyGoodnessScale} from "./parseUtils.js";
import {fetchAllFromAPI} from "./apiUtils.js";
import fs from 'fs';

export const getTimeRange = (nbOfHours) => {
    const now = new Date();
    const min = new Date();
    min.setHours(now.getHours() - nbOfHours);
    return ({min: min, max: now})
}

export const updateDb = async (db, access_token, dateRange, campus_id) => {
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
}

export const parseHours = () => {
    let hours = process.env.EVAL_TIMEFRAME || 72; 
    if (process.argv[2] === 'fetch') {
        hours = parseInt(process.argv[3])
        if (!hours) {
            console.log('usage: npm run fetch [time_in_hours]')
            process.exit(1)}
        if (fs.existsSync('./evaluations.db'))
            fs.unlinkSync('./evaluations.db')
    }
    return hours;
}
