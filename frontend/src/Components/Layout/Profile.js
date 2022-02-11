import React, {useEffect, useState} from 'react';
import {useParams, Link, useNavigate} from 'react-router-dom';
import {formatIntegers, imageForStory} from '../utils';
import Like from '../../static/icons/minimalistic_like.svg';
import View from '../../static/icons/views.svg';
import jwt from 'jwt-decode';


function Profile() {
    const [stories, setStories] = useState([]);
    const [profile, setProfile] = useState({});
    const {username} = useParams();
    const [jwtDecode, setJwtDecode] = useState({});
    const navigate = useNavigate();
    const isLogin = localStorage.getItem('isLogin');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const responseProfile = await fetch(`http://localhost:8000/api/v1/profileData/${username}`);
                const responseStories = await fetch(`http://localhost:8000/api/v1/profileStories/${username}`);
                const profileStories = await responseStories.json();
                const profileData = await responseProfile.json();
                if(!responseProfile.ok){
                    navigate('/');
                }
                setProfile(profileData);
                setStories(profileStories);
                setIsLoading(true);
                if(isLogin){
                    const jwtToken = jwt(localStorage.getItem('access'));
                    setJwtDecode(jwtToken);
                }
            }catch(error){
                console.log(error);
            }
        }
        fetchData();
    }, [isLogin, username, navigate])

    const renderItems = () => {
        const listOfStories = stories;
        
        return listOfStories.map(item => (
            <div className="story" key={item.id} style={imageForStory(item.image)}>
                <Link to={"/story/" + item.url}>
                <div className="black"></div>
                </Link>
                <div className="story-category-div">
                    <Link to={"/category/" + item.category.url} className="story-category">{item.category.title}</Link>
                </div>
                <div className="story-rating-views-div">
                <span className="story-rating"><img src={Like} alt="" className="story-rating-image"/> {formatIntegers(item.rating)}</span>
                <span className="story-views"><img src={View} alt="" className="story-views-image"/>{formatIntegers(item.views)}</span>
                </div>
                <div className="story-title-div">
                <h3 className="story-title">{item.title}</h3>
                <p className="story-slogan">{item.shortinfo}</p>
                </div>
            </div>
    ))};

    const handleExitSubmit = (event) => {
        event.preventDefault();
        localStorage.clear();
        navigate('/');
        window.location.reload();
    }

    const profileActions = () => {
        if(jwtDecode.user_id === profile.id){
            return (
            <div className="profile-actions-div">
                <Link to="/profile/edit/" className="profile-edit">Изменить профиль</Link>
                <Link to="/story/create/" className="profile-edit">Создать историю</Link>
                <Link to="/" onClick={handleExitSubmit} className="profile-edit">Выйти</Link>
            </div>
            )
        }else{
            return (<></>)
        }
    }

  return (
  <>
  {isLoading && 
   <>
    <div className="side-bar-profile-div">
        <div className="stories-theme-div">
            <h4 className="stories-theme">Профиль</h4>
        </div>
        
        <div className="profile">
            <div className="profile-image-div">
                <img src={profile.profile_picture} className="profile-image" alt={profile.username} />
            </div>

            <div className="profile-header-div">
                <div className="profil-header-name-div">
                    <h4 className="profile-header-name">
                        {profile.username}
                    </h4>
                </div>
                <div className="profile-header-rank">
                    <p className="profile-header-rank">Звание: {profile.status}</p>
                    <div className="profile-mini-info-div">
                        <div className="profile-counters-div">
                            <p className="profile-count">
                            {stories.length} <br/>
                            Историй
                            </p>
                        </div>
                        <div className="profile-counters-div">
                            <p className="profile-count">
                            0 <br/>
                            Рейтинг
                            </p>
                        </div>
                    </div>
                </div>
                {profileActions()}
            </div>
        </div>
    </div>
    <div className="stories-st-theme-div">
        <div className="stories-theme-div">
            <h4 className="stories-theme">{jwtDecode.user_id === profile.id ? 'Ваши истории' : `Истории автора ${profile.username}`}</h4>
        </div>
        <div className="stories">
            {renderItems()}
        </div>
    </div>
   </> 
  }
  </>
  );
}

export default Profile;