import axios from "axios";

const getToken = async () => {
    const { UID, SECRET } = process.env
    try {
        const response = await axios.post(
            'https://api.intra.42.fr/oauth/token',
            {
                grant_type: 'client_credentials',
                client_id: UID,
                client_secret: SECRET,
                redirect_uri: 'http://localhost:3000/api/login'
            })
        return response.data.access_token;
    } catch (error) {
        console.log(error)
    }
}

export default getToken;