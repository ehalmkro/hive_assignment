import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/evaluations'

export const getEvaluations = async (page= 1) => {
    const response = await axios.get(`${baseUrl}/per_campus?page=${page}`)
    return response.data
}

export const getStats =  async () => {
    const response = await axios.get(`${baseUrl}/stats`)
    return response.data
}

export const getUsers =  async () => {
    const response = await axios.get(`${baseUrl}/users`)
    return response.data
}

export const getUserData = async (id) => {
    const response = await axios.get(`${baseUrl}/stats/${id}`)
    return response.data
}