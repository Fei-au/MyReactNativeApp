import axios from "axios";


export const errorHandler = (err)=>{
    if(axios.isAxiosError(err)){
        alert(`${err.response.status} ${err.response.statusText}: ${err.response.data}`);
    }else{
        alert(err.message);
    }
}