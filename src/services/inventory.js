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
        const {data} = await axios.get(`${address}${app}/get_item_info_by_code/${code}`);
        if(data.status === 'success'){
            const r = JSON.parse(data.data);
            return r[0].fields;
        }else if(data.status === 'not found'){
            throw new NotFoundError('not found');
        }
    }catch(err){
        console.log('err', err)
    }
}

export const scrap_info_by_bo_code = async (code)=>{
    console.log('address', `${address}${app}/scrap_info_by_bo_code/${code}`);
    try{
        const res = await axios.get(`${address}${app}/scrap_info_by_bo_code/${code}`);
    }catch(err){
        console.log('err',err)
        throw(err);
    }
}




