import React from 'react';
import {Link} from 'react-router-dom';

function Header(props){
    const isLogin = localStorage.getItem('isLogin');

    const isLoggined = () => {
        if(JSON.parse(isLogin) === true){
            const profile = JSON.parse(localStorage.getItem('profile'));
            return <Link to={"/profile/" + profile.username} className="menu-link">
                <div className="header-profile-div">
                    <img src={profile.profile_picture} className="header-profile-image" alt={profile.username} />
                </div>
            </Link>
        }else{
            return <Link to="/login/" className="menu-link enter">Войти</Link>
        }
    }

    const handleSubmitExit = (event) => {
        localStorage.clear();
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
