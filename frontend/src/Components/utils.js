import { useEffect } from 'react';
import {useLocation} from 'react-router-dom';

export const useScrollToTop = () => {
    const location = useLocation();
    useEffect(() => {
        window.scrollTo({top:0});
    }, [location])
}

export const imageForStory = (url) => {
    return {
    backgroundImage: `url(${url})`
    }
}

export const formatIntegers = (num) => {
    if (num >= 1000000){
    return num / 1000000 + "M"
    }else if(num >= 1000){
    return num / 1000 + "K"
    }else return num
}