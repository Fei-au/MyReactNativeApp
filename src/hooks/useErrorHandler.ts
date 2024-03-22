import axios, {AxiosError} from 'axios';
import { useToast } from 'native-base';

export const useErrorHandler = ()=>{
    const toast = useToast();

    const showError = (err: AxiosError | Error)=>{
        let message = 'Error happend';
        if(axios.isAxiosError(err)){
            message = err?.response?.data as string;
        }else{
            console.log('err.message', err.message)
            message = err.message;
        }
        toast.show({
            description: message,
            duration: 3,
        });
    }

    return showError;
}
export default useErrorHandler


