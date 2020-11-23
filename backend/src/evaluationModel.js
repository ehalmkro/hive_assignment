import sqlite3 from 'sqlite3'
import {open} from 'sqlite'
import {fetchAllFromAPI} from "../utils/apiUtils.js";
import {applyGoodnessScale} from "../utils/parseUtils.js";

sqlite3.verbose();

const openDb = async () => {
   return await open({
            filename: './evaluations.db',
            driver: sqlite3.Database
        })
}

const init = async (db, dateRange, access_token) => {
    await db.run('CREATE TABLE IF NOT EXISTS json(json text)')
    let evaluationList;
    if ((await countAll(db)).COUNT === 0) {
        evaluationList = applyGoodnessScale(await fetchAllFromAPI(
            `/scale_teams?range[filled_at]=${dateRange.min.toISOString()},${dateRange.max.toISOString()}`, access_token))
        await save(db, evaluationList)
    }
    else
        evaluationList = await getJSON(db)
return evaluationList
}

const save = async (db, json) => {
    const data = JSON.stringify(json)
    await db.run('INSERT INTO json VALUES (?)', data)
}

const countAll = async (db) => {
    return await db.get('SELECT COUNT(*) as COUNT FROM json')
}

const getJSON = async (db) => {
    const result = await db.all('SELECT * FROM json')
    return JSON.parse(result[0].json)
}

export default { openDb, init, save, countAll, getJSON }

