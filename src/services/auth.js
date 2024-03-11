import axios from "axios"
import { AuthFailedError, NotFoundError } from "../utils/customizeError";
import { APIURL } from "../Constants";

const app = 'staff';
console.log('APIURL', APIURL)
export const login = async (code)=>{
    try{
        const {data} = await axios.post(`${APIURL}${app}/login`, code);
        if(data.status === 'success'){
            return data;
        }else{
            throw new AuthFailedError('Login failed');
        }
    }catch(err){
        console.log('err', err)
        throw new Error(err)
    }
}