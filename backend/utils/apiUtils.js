import axios from "axios";
import dotenv from 'dotenv';

const baseUrl = 'https://api.intra.42.fr/v2';

const getToken = async () => {
    dotenv.config();
    const {UID, SECRET} = process.env
    try {
        const response = await axios.post(
            'https://api.intra.42.fr/oauth/token',
            {
                grant_type: 'client_credentials',
                client_id: UID,
                client_secret: SECRET,
                redirect_uri: 'http://localhost:3001'
            })
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

const requestAPI = async (requestURI, token, parameters = null) => {
    try {
        const response = await axios
            .get(`${baseUrl}${requestURI}`, {
                headers: {Authorization: `Bearer ${token}`},
                params: parameters
            })
        return response
    } catch (error) {
        console.log(error)
    }
}


const fetchAllFromAPI = async (request, token, parameters = null) => {
    console.log(`fetching ${request}`)

    const maxCount = (await requestAPI(request, token, {...parameters, per_page: 1}))
        .headers['x-total'];
    const allData = [];
    for (let page = 1; page <= Math.round(maxCount / 100); page++)
    {
        console.log(`fetching page ${page}/${Math.round(maxCount/100)}`)
        let data = (await requestAPI(request, token, {
            ...parameters,
            per_page: 100,
            page: page
        })).data;
        await new Promise(r => setTimeout(r, 500));
        allData.push(...data)
    }
    return allData;
}


export {getToken, requestAPI, fetchAllFromAPI};