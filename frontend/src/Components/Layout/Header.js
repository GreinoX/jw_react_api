import React, { useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import jwt from 'jwt-decode';
import {updateJWTToken} from '../utils';


function Header(props){
    const isLogin = localStorage.getItem('isLogin');
    let profile = localStorage.getItem('profile');
    const navigate = useNavigate();

    useEffect(() => {
        updateJWTToken();
    })

    const isLoggined = () => {
        if(isLogin && profile){
            profile = JSON.parse(profile);
            return <Link to={"/profile/" + profile.username} className="menu-link">
                <div className="header-profile-div">
                    <img src={profile.profile_picture} className="header-profile-image" alt={profile.username} />
                </div>
            </Link>
        }else{
            return <Link to="/login/" className="menu-link enter">Войти</Link>
        }
    }

    return (
        <div className="header">
            <div className="header-div">
                <div className="header-logo-div">
                    <Link to="/" className="header-logo">ПростоПиши</Link>
                </div>
                <div className="menu-div">
                    <Link to="/" className="menu-link">Истории</Link>
                    <Link to="/quotes" className="menu-link">Рецензии</Link>
                    <Link to="/about" className="menu-link">Инфо</Link>
                    {isLoggined()}
                </div>
            </div>
            <hr />
        </div>
    )
}

export default Header;
