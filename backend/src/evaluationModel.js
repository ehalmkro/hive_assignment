import sqlite3 from 'sqlite3'
import {open} from 'sqlite'


sqlite3.verbose();

const openDb = async () => {
   const db =  await open({
            filename: './evaluations.db',
            driver: sqlite3.Database
        })
    await db.run('CREATE TABLE IF NOT EXISTS json(json text)')
    return db;
}

const save = async (db, json) => {
    const data = JSON.stringify(json)
    await db.run('INSERT INTO json VALUES (?)', data)
}

const countAll = async (db) => {
    return await db.get('SELECT COUNT(*) as COUNT FROM json')
}

const getAllJSON = async (db) => {
    const result = await db.all('SELECT * FROM json')
    return JSON.parse(result[0].json)
}


export default { openDb, save, countAll, getAllJSON }

