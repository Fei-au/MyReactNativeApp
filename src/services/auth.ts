import axios from "axios"
import { AuthFailedError, NotFoundError } from "../utils/customizeError";
import { APIURL } from "../Constants";
import { loginType } from "../utils/types";

const app = 'staff';
console.log('APIURL', APIURL)
export const login = async (code: loginType)=>{
    const {data} = await axios.post(`${APIURL}${app}/login`, code);
    if(data.status === 'success'){
        return data;
    }else{
        throw new AuthFailedError('Login failed');
    }
}

export const get_next_item_number = async (id: number)=>{
    console.log('APIURL', `${APIURL}${app}/get_next_item_number/${id}`);
    const {data} = await axios.get(`${APIURL}${app}/get_next_item_number/${id}`);
    return data;
}




