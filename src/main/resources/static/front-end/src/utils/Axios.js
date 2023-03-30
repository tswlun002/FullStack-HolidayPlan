import axios from 'axios'


export default axios.create(
    {  
        baseURL:'http://localhost:3000'
    }
);

export const AxiosPrivate=  axios.create(
    {
        baseURL:'http://localhost:3000',
        headers:{'Content-Type':'application/json; charset=UTF-8'},
        withCredentials:true,
    }
)

