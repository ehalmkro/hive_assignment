import sqlite3 from 'sqlite3'
import {open} from 'sqlite'


sqlite3.verbose();

const openDb = async () => {
    const db = await open({
        filename: './evaluations.db',
        driver: sqlite3.Database
    })
    await db.run('CREATE TABLE IF NOT EXISTS scale_teams(json text)')
    await db.run('CREATE TABLE IF NOT EXISTS users(json text)')
    return db;
}

const save = async (db, json, table) => {
    const data = JSON.stringify(json)
    await db.run(`INSERT INTO ${table} VALUES (?)`, data)
}

const countAll = async (db, table) => {
    return await db.get(`SELECT COUNT(*) as COUNT FROM ${table}`)
}

const getAllJSON = async (db, table) => {
    const result = await db.all(`SELECT * FROM ${table}`)
    return JSON.parse(result[0].json)
}


export default {openDb, save, countAll, getAllJSON}

