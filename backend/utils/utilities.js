import axios from "axios";

const baseUrl = 'https://api.intra.42.fr/v2';

const getToken = async () => {
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
        return response.data;
    } catch (error) {
        console.log(error)
    }
}


const fetchAllFromAPI = async (request, token, parameters = null) => {
    console.log(`fetching ${request}`)
    let data = await requestAPI(request, token, {...parameters, per_page: 100});
    if (data.length < 100)
        return data;
    let allData = data;
    let page = 2;
    
    const apiLooper = async () => {
        console.log('working...')
        return await new Promise(resolve => {
        const intervalID = setInterval(async () => {
            data = await requestAPI(request, token, {
                ...parameters,
                per_page: 100,
                page: page
            });
            page = page + 1;
            allData.push(...data);
            if (data.length < 100) {
                clearInterval(intervalID)
                console.log(`done fetching ${request}`)
                resolve(allData)
            }
        }, 750)
        })
    }

    return apiLooper();
}


export {getToken, requestAPI, fetchAllFromAPI};