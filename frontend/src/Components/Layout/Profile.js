import React, {useEffect, useState} from 'react';
import {useParams, Link, useNavigate} from 'react-router-dom';
import {formatIntegers, imageForStory, updateJWTToken} from '../utils';
import Like from '../../static/icons/minimalistic_like.svg';
import View from '../../static/icons/views.svg';
import EditIcon from '../../static/icons/edit.svg';
import PlusIcon from '../../static/icons/plus.svg';
import LogoutIcon from '../../static/icons/logout.svg';
import jwt from 'jwt-decode';


function Profile() {
    const {username} = useParams();
    const [stories, setStories] = useState([]);
    const [profile, setProfile] = useState([]);
    const [bookmarksStories, setBookmarksStories] = useState([]);
    const [jwtDecode, setJwtDecode] = useState({});
    const [isLoadingStories, setIsLoadingStories] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [bookmarkSubmit, setBookmarkSubmit] = useState(false);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const [fetching, setFetching] = useState(true);
    const jwtToken = localStorage.getItem('access');
    const navigate = useNavigate();
    const isLogin = localStorage.getItem('isLogin');
    const [bookmarkPage, setBookmarkPage] = useState(1);
    const [bookmarkCount, setBookmarkCount] = useState(0);
    const [bookmarkFetching, setBookmarkFetching] = useState(true);

    useEffect(() => {
        setStories([]);
        setFetching(true);
        setCount(0);
        setPage(1); 
    },[username])

    useEffect(() => {
        const fetchProfileData = async () => {
            try{
                const response = await fetch(`http://localhost:8000/api/v1/profileData/${username}`)
                .then(res => res.json())
                .then(data => {
                    setProfile(data);
                    setIsLoadingProfile(true);
                    document.title = `Просто Пиши | Автор ${data.username}`;
                    if(isLogin && jwtToken){
                        const jwtDecode = jwt(jwtToken);
                        setJwtDecode(jwtDecode);
                        if(jwtDecode.user_id === data.id){
                            document.title = "Просто Пиши | Мой профиль"
                        }
                    }
                })
            }catch(e){
                console.log(e)
            }
        }
        fetchProfileData()
    }, [username])

    useEffect(() => {
        const fetchData = async () => {
            try{
                const responseStories = await fetch(`http://localhost:8000/api/v1/profileStories/${username}?p=${page}&page_size=6`)
                .then(res => res.json())
                .then(data => {
                    if(page === 1){
                        setStories([...data.results])
                    }else{
                        setStories([...stories, ...data.results])
                    }
                    setStories([...stories, ...data.results]);
                    setCount(data.count);
                    setIsLoadingStories(true);
                    setPage(prevState => prevState + 1);
                })
                .finally(() => {
                    setFetching(false);
                })
            }catch(e){
                console.log(e);
            }
        }
        fetchData();
    }, [fetching])


    useEffect(() => {
        if(bookmarkSubmit){
            if(jwtToken && profile && isLogin){
                const fetchData = async () => {
                    updateJWTToken();
                    try{
                        const jwtDecode = jwt(jwtToken);
                        const requestOptions = {
                            method: "GET", 
                            headers: {
                                'Authorization': `JWT ${jwtToken}`,
                                'Content-Type': 'application/json'
                            }
                        }
                        const response = await fetch(`http://localhost:8000/api/v1/story/byBookmarks/${jwtDecode.user_id}?p=${bookmarkPage}`, requestOptions)
                        .then(res => res.json())
                        .then(data => {
                            const result = data.results.map(elem => {
                                return elem.story
                            });
                            setBookmarksStories([...bookmarksStories, ...result]);
                            setBookmarkPage(prevState => prevState + 1);
                            setBookmarkCount(data.count);
                            console.log(data)
                        }).finally(() => {
                            setBookmarkFetching(false);
                        })
                    }catch(error){
                        console.log(error)
                    }
                }
                fetchData();
            }
        }
    }, [bookmarkFetching, bookmarkSubmit])

    useEffect(() => {
        document.addEventListener('scroll', scrollHanlder);
        return function(){
            document.removeEventListener('scroll', scrollHanlder);
        }
    })

    const scrollHanlder = (e) => {
        if(e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100 && stories.length !== count && !bookmarkSubmit){
            setFetching(true); 
        }
        if(e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100 && bookmarksStories.length !== bookmarkCount && bookmarkSubmit){
            setBookmarkFetching(true);
        }
    }

    const renderItems = () => {
        const listOfStories = bookmarkSubmit ? bookmarksStories : stories;

        if(listOfStories.length === 0){
            return (
                <>
                <div className="story">
                    <div className="black" style={{background: "linear-gradient(180deg, rgba(12, 12, 14, 0.83) 0%, rgba(255, 255, 255, 0) 121%)", backgroundColor: "none"}}></div>
                    <div className="story-title-div">
                        <h3 className="story-title">{bookmarkSubmit ? "Добавьте что-нибудь в избранное чтобы увидеть здесь" : "У вас тут как-то пустовато"}</h3>
                    </div>
                </div>
                <div className="story">
                    <div className="black" style={{background: "linear-gradient(180deg, rgba(12, 12, 14, 0.83) 0%, rgba(255, 255, 255, 0) 121%)", opacity: "1"}}></div>
                </div>
                <div className="story">
                    <div className="black" style={{background: "linear-gradient(180deg, rgba(12, 12, 14, 0.83) 0%, rgba(255, 255, 255, 0) 121%)", opacity: "1"}}></div>
                </div>
                </>
            )
        }

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
    }

    const handleBookmarkPage = (event) => {
        setBookmarkSubmit(true);
    }

    const handleProfileStories = (event) => {
        setBookmarkSubmit(false);
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
  {isLoadingStories && isLoadingProfile && 
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
                            {count} <br/>
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
                {bookmarkSubmit ? 'Избранное' : 'Мои истории'}
                </>
            ) : `Истории автора ${profile.username}`}</h4>
            {jwtDecode.user_id === profile.id && (
                <>
                <div className="profile-actions-stories">
                    <p className="in-bookmarks" onClick={bookmarkSubmit ? handleProfileStories : handleBookmarkPage}>{bookmarkSubmit ? "Мои истории" : "Избранное"}</p>
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