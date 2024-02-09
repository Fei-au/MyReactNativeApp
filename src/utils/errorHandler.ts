import {AxiosError} from 'axios';
import { Alert } from 'react-native';

export const axiosErrorHandler = (err: AxiosError)=>{
    console.log('err', err)
    console.log('err?.response?', err?.response)
    console.log('status', err?.response?.status)
    console.log('data', err?.response?.data)
    Alert.alert('hello');
}

export const normalErrorHandler = (err: Error)=>{
    Alert.alert(err.message);
}
