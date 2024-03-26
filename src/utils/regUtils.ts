export const getUrl = (str)=>{
    const regex = /https:\/\/.+$/;
    const match = str.match(regex);
    if(match){
        return match[0]
    }else{
        return null
    }
} 