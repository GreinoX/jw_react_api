import React, {useEffect, useState} from 'react';
import {useParams, Link, useNavigate} from 'react-router-dom';
import {formatIntegers, imageForStory} from '../utils';
import Like from '../../static/icons/minimalistic_like.svg';
import View from '../../static/icons/views.svg';
import EditIcon from '../../static/icons/edit.svg';
import PlusIcon from '../../static/icons/plus.svg';
import LogoutIcon from '../../static/icons/logout.svg';
import jwt from 'jwt-decode';


function Profile() {
    const [stories, setStories] = useState([]);
    const [profile, setProfile] = useState([]);
    const [bookmarksStories, setBookmarksStories] = useState([]);
    const {username} = useParams();
    const [jwtDecode, setJwtDecode] = useState({});
    const jwtToken = localStorage.getItem('access');
    const navigate = useNavigate();
    const isLogin = localStorage.getItem('isLogin');
    const [isLoading, setIsLoading] = useState(false);
    const [bookmarkSubmit, setBookmarkSubmit] = useState(false);

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
                document.title = `Просто Пиши | Профиль ${profileData.username}`;
                if(isLogin){
                    const jwtToken = jwt(localStorage.getItem('access'));
                    setJwtDecode(jwtToken);
                    if(jwtToken.user_id === profileData.id){
                        document.title = "Просто Пиши | Личный Профиль"
                    }
                }
            }catch(error){
                console.log(error);
            }
        }
        fetchData();
    }, [username])

    const renderItems = () => {
        const listOfStories = bookmarkSubmit ? bookmarksStories : stories;

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

    const handleBookmarkPage = (event) => {
        if(jwtToken && profile && isLogin){
            const fetchData = async () => {
                try{
                    const jwtDecode = jwt(jwtToken);
                    const requestOptions = {
                        method: "GET",
                        headers: {
                            'Authorization': `JWT ${jwtToken}`,
                            'Content-Type': 'application/json'
                        }
                    }
                    const response = await fetch(`http://localhost:8000/api/v1/story/byBookmarks/${jwtDecode.user_id}`, requestOptions)
                    if(response.ok){
                        const data = await response.json()
                        if(data){
                            setBookmarksStories(data.map(elem => {
                                return elem.story
                            }))
                            setBookmarkSubmit(true);
                        }
                    }
                }catch(error){
                    console.log(error)
                }
            }
        if(bookmarksStories.length !== 0){
            setBookmarkSubmit(true)
        }else{
            fetchData()
        }
        }
    }

    const handleProfileStories = (event) => {
        setBookmarkSubmit(false)
    }

    const profileActions = () => {
        if(jwtDecode.user_id === profile.id){
            return (
            <div className="profile-actions-div">
                <Link to="/profile/edit/" className="profile-edit">
                    <img src={EditIcon} alt="" />
                    Изменить профиль
                </Link>
                <Link to="/story/create/" className="profile-edit">
                    <img src={PlusIcon} alt="" />
                    Создать историю</Link>
                <Link to="/" onClick={handleExitSubmit} className="profile-edit">
                    <img src={LogoutIcon} alt="" />
                    Выйти</Link>
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
                <img src={profile.profile_picture ? profile.profile_picture : "/media/users/default.png"} className="profile-image" alt={profile.username} />
            </div>

            <div className="profile-header-div">
                <div className="profil-header-name-div">
                    <h4 className="profile-header-name">
                        {profile.first_name || profile.last_name ? profile.first_name + " " + profile.last_name : profile.username}
                    </h4>
                </div>
                <div className="profile-header-rank">
                    {profile.status && (
                    <p className="profile-header-rank">Статус: {profile.status}</p>
                    )}
                    <div className="profile-mini-info-div">
                        <div className="profile-counters-div">
                            <p className="profile-count">
                            {stories.length} <br/>
                            Историй
                            </p>
                        </div>
                        <div className="vert-hr"></div>
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
            <h4 className="stories-theme">{jwtDecode.user_id === profile.id ? (
                <>
                {bookmarkSubmit ? 'Избранное' : 'Ваши истории'}
                </>
            ) : `Истории автора ${profile.username}`}</h4>
            {jwtDecode.user_id === profile.id && (
                <>
                <div className="profile-actions-stories">
                    <p className="in-bookmarks" onClick={bookmarkSubmit ? handleProfileStories : handleBookmarkPage}>{bookmarkSubmit ? "Ваши истории" : "Избранное"}</p>
                </div>
                </>
            )}
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