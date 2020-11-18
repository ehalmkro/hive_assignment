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


export {getToken, requestAPI};