import React, {useEffect, useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import {formatIntegers, imageForStory} from '../utils';
import Like from '../../static/icons/minimalistic_like.svg';
import View from '../../static/icons/views.svg';


function Profile() {
    const [stories, setStories] = useState([]);
    const isLogin = JSON.parse(localStorage.getItem('isLogin'));
    const profile = JSON.parse(localStorage.getItem('profile'));

    useEffect(() => {
        if(isLogin){
            console.log('Okay')
            const profile = JSON.parse(localStorage.getItem('profile'));
            const accessJWT = localStorage.getItem('access');
            const fetchData = async () => {
                try{
                    const requestOptions = {
                        method: 'GET',
                        headers : {
                            'Content-Type': 'application/json',
                            'Authorization': `JWT ${accessJWT}`}
                    };
                    const response = await fetch(`http://localhost:8000/api/v1/profileStories/${profile.username}`, requestOptions);
                    if(response.status === 200){
                        const stories = await response.json();
                        setStories(stories);
                    }
                }catch(error){
                    console.log(error);
                }
            }
            fetchData();
        }else{
            console.log('not logined');
        }
    }, [isLogin]);

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

  return (
  <>
    <div className="side-bar-profile-div">
        <div className="stories-theme-div">
            <h4 className="stories-theme">Профиль</h4>
        </div>
        
        <div className="profile">
            <div className="profile-image-div">
                <img src={profile.profile_picture} class="profile-image" alt={profile.username} />
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
                            6 <br/>
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
            </div>
        </div>
    </div>
    <div className="stories-st-theme-div">
        <div className="stories-theme-div">
            <h4 className="stories-theme">Ваши истории</h4>
        </div>
        <div className="stories">
            {renderItems()}
        </div>
    </div>
  </>
  );
}

export default Profile;