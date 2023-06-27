//import axios
import axios from 'axios';

const Api = axios.create({
    //set default endpoint API
    baseURL: 'https://bimeal-api.fikriyuwi.com/'
})

export default Api