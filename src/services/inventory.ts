import axios from "axios"
import { NotFoundError } from "../utils/customizeError";
import { APIURL } from "../Constants";
import { itemType } from "../utils/types";
import FormData from "form-data";

const app = 'inventory';

export const get_item_info_by_code = async (code: string)=>{
    console.log('APIURL', `${APIURL}${app}/get_item_info_by_code/${code}`)
    const {data} = await axios.get(`${APIURL}${app}/get_item_info_by_code/${code}`);
    if(data.status === 'success'){
        return data.data;
    }else if(data.status === 'not found'){
        throw new NotFoundError(data.message);
    }
}

export const scrap_info_by_url = async (url: string)=>{
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

export const scrap_info_by_num_code = async (code: number | string)=>{
    const {data} = await axios.get(`${APIURL}${app}/scrap_info_by_num_code/${code}`);
    if(data.status === 'success'){
        return data.data;
    }else if(data.status === 'not found'){
        throw new NotFoundError(data.message);
    }
}

export const add_new_item = async (item: FormData)=>{
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

export const image_upload = async(image: FormData)=>{
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

export const get_last_items = async(staff_id: number, page_number_from_last: number)=>{
    const {data} = await axios.get(`${APIURL}${app}/get_last_items/${staff_id}`, {
        params: {
            page_number_from_last: page_number_from_last
        }
    });
    return data;
}

export const delete_item = async(id: number)=>{
    const {data} = await axios.delete(`${APIURL}${app}/delete_item/${id}`);
    return data;
}

