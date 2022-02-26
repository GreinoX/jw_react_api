import { useEffect } from 'react';
import {useLocation} from 'react-router-dom';
import { useNavigate } from 'react-router';
import jwt from 'jwt-decode';

export const useScrollToTop = () => {
    const location = useLocation();
    useEffect(() => {
        window.scrollTo({top:0});
    }, [location])
}

export const imageForStory = (url) => {
    return {
    backgroundImage: `url(${url ? url : "/media/stories/standart.png"})`
    }
}

export const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export const formatIntegers = (num) => {
    if (num >= 1000000){
    return num / 1000000 + "M"
    }else if(num >= 1000){
    return num / 1000 + "K"
    }else return num
}

export const updateJWTToken = () => {
    const refreshJWTToken = localStorage.getItem('refresh');
    const isLogin = localStorage.getItem('isLogin');
    const profile = localStorage.getItem('profile');
    const jwtToken = localStorage.getItem('access');

    if(jwtToken && profile && isLogin && refreshJWTToken){
        try{
            const jwtDecode = jwt(jwtToken);
            if(jwtDecode.exp < Date.now() / 1000){
                if(isLogin && refreshJWTToken){
                    const fetchData = async () => {
                        const requestOptions = {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({refresh: refreshJWTToken})
                        }
                        await fetch('http://localhost:8000/auth/jwt/refresh/', requestOptions).then(res => res.json()).then((data) => {
                            localStorage.setItem('access', data.access);
                        }).catch((error) => {
                            localStorage.clear();
                            const navigate = useNavigate();
                            navigate('/');
                            window.location.reload();
                        });
                    }
                    fetchData();
                }
            }
        }catch{
            localStorage.clear();
            window.location.replace('/');
            window.location.reload();
        }
    }else{
        localStorage.clear()
    }
}

export const Logout = () => {
    localStorage.clear();
    const navigate = useNavigate();
    navigate('/');
    window.location.reload();
}