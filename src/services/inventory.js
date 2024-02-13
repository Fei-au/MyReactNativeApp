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
            throw new NotFoundError(data.message);
        }
    }catch(err){
        throw new Error(err)
    }
}

export const scrap_info_by_url = async (url)=>{
    try{
        console.log('address', `${address}${app}/scrap_info_by_url/${url}`);
        const {data} = await axios.get(`${address}${app}/scrap_info_by_url/${url}`);
        if(data.status === 'success'){
            return data.data;
        }else if(data.status === 'not found'){
            throw new NotFoundError(data.message);
        }
    }catch(err){
        throw(err);
    }
}

export const add_new_item = async (item)=>{
    try{
        const {data} = await axios.post(`${address}${app}/add_new_item`, item);
        return data;
    }catch(err){
        throw(err);
    }
}



export const getStatus = async ()=>{
    console.log('address', `${address}${app}/status`);
    const {data} = await axios.get(`${address}${app}/status`);
    return data;
}

export const getCategory = async ()=>{
    console.log('address', `${address}${app}/category`);
    const {data} = await axios.get(`${address}${app}/category`);
    return data;
}







