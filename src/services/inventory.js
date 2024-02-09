import axios from "axios"
import { BACKEND_ADDRESS } from '@env';
import { NotFoundError } from "../utils/customizeError";

// const address = BACKEND_ADDRESS;
const address = 'http://192.168.2.79:8000/';
const app = 'inventory';
console.log('address', address);
console.log('address', process.env);

export const get_item_info_by_code = async (code)=>{
    try{
        console.log('address', `${address}${app}/get_item_info_by_code/${code}`)
        const {data} = await axios.get(`${address}${app}/get_item_info_by_code/${code}`);
        if(data.status === 'success'){
            return data.data;
        }else if(data.status === 'not found'){
            throw new NotFoundError('not found');
        }
    }catch(err){
        throw new Error(err)
    }
}

export const scrap_info_by_bo_code = async (code)=>{
    console.log('address', `${address}${app}/scrap_info_by_bo_code/${code}`);
    try{
        const res = await axios.get(`${address}${app}/scrap_info_by_bo_code/${code}`);
    }catch(err){
        throw(err);
    }
}




