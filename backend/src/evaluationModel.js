import sqlite3 from 'sqlite3'
import {open} from 'sqlite'

sqlite3.verbose();

const openDb = async () => {
   return await open({
            filename: './evaluations.db',
            driver: sqlite3.Database
        })
}

const init = async (db) => {
    await db.run('CREATE TABLE IF NOT EXISTS json(json text)')
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

