import axios from "axios"
import { AuthFailedError, NotFoundError } from "../utils/customizeError";
import { APIURL } from "../Constants";

const app = 'staff';

export const login = async (code)=>{
    try{
        const {data} = await axios.post(`${APIURL}${app}/login`, code);
        if(data.status === 'success'){
            return data;
        }else{
            throw new AuthFailedError('Login failed');
        }
    }catch(err){
        throw new Error(err)
    }
}