import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import LikeWhite from '../../static/icons/white-lik.svg';
import Like from '../../static/icons/minimalistic_like.svg'
import View from '../../static/icons/views.svg';
import Delete from '../../static/icons/delete.svg';
import Bookmark from '../../static/icons/bookmark.svg';
import BookmarkFill from '../../static/icons/bookmark_fill.svg';
import {Link} from 'react-router-dom';
import SideBar from './SideBar';
import { imageForStory, updateJWTToken, useScrollToTop } from '../utils';
import jwt from 'jwt-decode';
import parse from "html-react-parser";

function Story() {
    const {url_id} = useParams();
    const [post, setPost] = useState([]);
    const [postLikes , setPostLikes] = useState(0);
    const [category, setCategory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const profile = localStorage.getItem('profile');
    const isLogin = localStorage.getItem('isLogin');
    const jwtToken = localStorage.getItem('access');
    const [jwtDecode, setJwtDecode] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmark, setIsBookmark] = useState(false);
    const [isModalPage, setIsModalPage] = useState(false);
    const navigate = useNavigate();

    useScrollToTop();
    
    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch(`http://localhost:8000/api/v1/story/${url_id}`).then(res => res.json());
                setPost(response);
                setPostLikes(response.rating);
                setCategory(response.category);
                console.log(response)
                document.title = "Просто Пиши | " + response.title;
                if(jwtToken && isLogin && profile){
                    try{
                        const JWTDecode = jwt(jwtToken);
                        setJwtDecode(JWTDecode);
                        const requestOptions = {
                            method: "GET",
                            headers: {
                                'Authorization': `JWT ${jwtToken}`
                            }
                        }
                        const responseLiked = await fetch(`http://localhost:8000/api/v1/profileStoryRelation/${JWTDecode.user_id}/${response.id}`, requestOptions);
                        if(responseLiked.ok){
                            const dataLiked = await responseLiked.json();
                            setIsLiked(dataLiked.is_liked)
                            setIsBookmark(dataLiked.is_bookmarks)
                        }
                    }catch(error){
                        console.log(error);
                    }
                }
                setIsLoading(true);
            }catch(error){
                console.log(error);
            }
        }
        fetchData();
    }, [url_id])

    const handleDelete = (event) => {
        event.preventDefault();
        setIsModalPage(true);
    }

    const handleCloseDelete = (event) => {
        setIsModalPage(false);
    }

    const handleDeleteSubmit = (event) => {
        event.preventDefault();
        if(profile && jwtToken && jwtDecode){
            const fetchData = async () => {
                updateJWTToken();
                try{
                    const requestOptions = {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `JWT ${jwtToken}`
                        }
                    }
                    const response = await fetch(`http://localhost:8000/api/v1/story/destroy/${post.id}`, requestOptions);
                    if(response.ok){
                        navigate("/")
                    }
                }catch(error){
                    console.log(error)
                }
            }
        fetchData();
        }
    }

    const handleLikeSubmit = (event) => {
        if(isLogin && jwtDecode && profile){
            const fetchData = async () => {
                updateJWTToken();
                try{
                    const requestOptions = {
                        method: "PUT",
                        headers: {
                            'Authorization': `JWT ${jwtToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({user: jwtDecode.user_id, story: post.id, is_liked: isLiked ? false : true})
                    }
                    const response = await fetch(`http://localhost:8000/api/v1/profileStoryRelation/update/${jwtDecode.user_id}/${post.id}`, requestOptions);
                    if(response.ok){
                        setIsLiked(isLiked ? false : true)
                        setPostLikes(isLiked ? parseInt(postLikes) - 1 : parseInt(postLikes) + 1)
                    }
                }catch(error){
                    console.log(error)
                }
            }
            fetchData();
        }
    }

    const handleBookmarkSubmit = (event) => {
        if(isLogin && jwtToken && profile){
            const fetchData = async () => {
                updateJWTToken();
                try{
                    const requestOptions = {
                        method: "PATCH",
                        headers: {
                            'Authorization': `JWT ${jwtToken}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({is_bookmarks: isBookmark ? false : true})
                    }
                    const response = await fetch(`http://localhost:8000/api/v1/profileStoryRelation/update/${jwtDecode.user_id}/${post.id}`, requestOptions);
                    if(response.ok){
                        console.log(await response.json())
                        setIsBookmark(isBookmark ? false : true)
                        console.log("hi")
                    }
                }catch(error){
                    console.log(error)
                }
            }
        fetchData();
        }

    }

  return (
      <>
      {isLoading &&
      <>
      <div className="story-detail-div" key={post.id}>
            <div className="story-header-div" style={imageForStory(post.image)} >
                <div className="story-header-black"></div>
                <div className="story-header-category-div">
                    <Link to={"/category/" + category.url} className="story-header-category">{category.title}</Link>
                </div>
                <div className="story-header-rating-views-div">
                    <span className="story-header-rating">
                        <img src={Like} alt="" className="story-header-rating-image"/>
                        {postLikes}
                    </span>
                    <span className="story-header-views">
                        <img src={View} alt="" className="story-header-views-image"/>
                        {post.views}
                    </span>
                </div>
                <div className="story-header-title-div">
                    <div className="story-header-si-ti-div">
                        <h3 className="story-header-title">{post.title}</h3>
                        <p className="story-header-slogan">{post.shortinfo}</p>
                    </div>
                </div>
            </div>
            <div className="story-like-div">
                <div className="like" onClick={handleLikeSubmit} style={isLiked ? {backgroundColor: "#C98949", width: "40px"} : {}}>
                    <img src={LikeWhite} style={isLiked ? {marginRight: "0px"} : {}} alt="" />
                    <span style={isLiked ? {position: "absolute", marginRight: "200px", opacity: "0"} : {}}>Понравилось</span>
                </div>
                <div className="bookmark" onClick={handleBookmarkSubmit} style={isBookmark ? {backgroundColor: "#C98949"} : {}}>
                    <img src={isBookmark ? BookmarkFill : Bookmark} alt="" />
                </div>
                <div className="profile-header">
                    <div className="header-profile-div">
                        <img src={post.creator.profile_picture} className="header-profile-image" alt="" />
                    </div>
                    <div className="profile-info-story">
                        <Link to={"/profile/" + post.creator.username} className="profile-username-story">{post.creator.first_name && post.creator.last_name ? `${post.creator.first_name} ${post.creator.last_name}` : `${post.creator.username}`}</Link>
                        <p className="profile-status-story">{post.creator.status}</p>
                    </div>
                </div>
            </div>
                {jwtDecode.user_id === post.creator.id && (
                <div className="story-detail-user-actions">
                    <>
                    <Link to={`/story/edit/${post.url}`} className="story-action">Редактировать</Link>
                    <div className="delete-action">
                        <a href="/" className="story-action delete-button" onClick={handleDelete}>Удалить</a>
                        {isModalPage && (
                            <div className="modal-page">
                                <div className="mdp-of-delete-div">
                                    <div className="delete-image">
                                        <img src={Delete} alt=""/>
                                    </div>
                                    <br />
                                    <p className="delete-text">Удалить историю?</p>
                                    <div className="delete-actions">
                                        <span className="access-button" onClick={handleDeleteSubmit}>Подтвердить</span>
                                        <span className="story-action-close" onClick={handleCloseDelete}>Отмена</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    </>
                </div>
                )}
                <br />
            <div className="story-detail-text">
                {parse(post.text)}
            </div>
        </div>
        <SideBar />
      </>
      }
        
    </>
  );
}

export default Story;