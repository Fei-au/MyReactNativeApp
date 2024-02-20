import axios from "axios"
import { NotFoundError } from "../utils/customizeError";
import { APIURL } from "../Constants";

const app = 'inventory';

export const get_item_info_by_code = async (code)=>{
    try{
        console.log('APIURL', `${APIURL}${app}/get_item_info_by_code/${code}`)
        const {data} = await axios.get(`${APIURL}${app}/get_item_info_by_code/${code}`);
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
        console.log('APIURL', `${APIURL}${app}/scrap_info_by_url`);
        const {data} = await axios.get(`${APIURL}${app}/scrap_info_by_url`,{
            params:{
                url: url
            }
        });
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
        const {data} = await axios.post(`${APIURL}${app}/add_new_item`, item, {
            headers: {
                'Content-Type': 'multipart/form-data',
              },
        });
        return data;
    }catch(err){
        console.log(err)
        throw(err);
    }
}

export const image_upload = async(image)=>{
    try{
        const {data} = await axios.post(`${APIURL}${app}/image_upload`, image, {
            headers: {
                'Content-Type': 'multipart/form-data',
              },
        });
        return data;
    }catch(err){
        console.log(err)
        throw(err);
    }
}



export const getStatus = async ()=>{
    console.log('APIURL', `${APIURL}${app}/status`);
    const {data} = await axios.get(`${APIURL}${app}/status`);
    return data;
}

export const getCategory = async ()=>{
    console.log('APIURL', `${APIURL}${app}/category`);
    const {data} = await axios.get(`${APIURL}${app}/category`);
    return data;
}







