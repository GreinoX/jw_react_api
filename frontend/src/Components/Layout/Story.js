import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import Like from '../../static/icons/minimalistic_like.svg';
import View from '../../static/icons/views.svg';
import Delete from '../../static/icons/delete.svg';
import {Link} from 'react-router-dom';
import SideBar from './SideBar';
import { imageForStory, updateJWTToken, useScrollToTop } from '../utils';
import jwt from 'jwt-decode';

function Story() {
    const {url_id} = useParams();
    const [post, setPost] = useState([]);
    const [category, setCategory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const profile = localStorage.getItem('profile');
    const isLogin = localStorage.getItem('isLogin');
    const jwtToken = localStorage.getItem('access');
    const [jwtDecode, setJwtDecode] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [isModalPage, setIsModalPage] = useState(false);
    const navigate = useNavigate();

    useScrollToTop();
    
    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch(`http://localhost:8000/api/v1/story/${url_id}`).then(res => res.json());
                setPost(response);
                setCategory(response.category);
                setIsLoading(true);
                document.title = "Просто Пиши | " + response.title;
                if(jwtToken && isLogin){
                    try{
                        setJwtDecode(jwt(jwtToken));
                    }catch(error){
                        console.log(error)
                    }
                }
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
        if(isLiked){
            setIsLiked(false);
            console.log('not liked')
        }else{
            setIsLiked(true);
            console.log('liked')
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
                        {post.rating}
                    </span>
                    <span className="story-header-views">
                        <img src={View} alt="" className="story-header-views-image"/>
                        {post.views}
                    </span>
                </div>
                <div className="story-header-title-div">
                    <h3 className="story-header-title">{post.title}</h3>
                    <p className="story-header-slogan">{post.shortinfo}</p>
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
                <br />
                </div>
                )}
            <div className="story-like-div">
                <div className="like" onClick={handleLikeSubmit} style={isLiked ? {bakgroundColor: "#C98949"} : {}}>
                    <img src={Like} alt="" />
                    <span>Понравилось</span>
                </div>
            </div>
            <div className="story-detail-text">
                {post.text}
            </div>
        </div>
        <SideBar />
      </>
      }
        
    </>
  );
}

export default Story;