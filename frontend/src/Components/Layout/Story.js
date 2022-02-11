import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import Like from '../../static/icons/minimalistic_like.svg';
import View from '../../static/icons/views.svg';
import {Link} from 'react-router-dom';
import SideBar from './SideBar';
import { useScrollToTop } from '../utils';

function Story() {
    const {url_id} = useParams();
    const [post, setPost] = useState([]);
    const [category, setCategory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useScrollToTop();
    
    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch(`http://localhost:8000/api/v1/story/${url_id}`).then(res => res.json());
                setPost(response);
                setCategory(response.category);
                setIsLoading(true);
            }catch(error){
                console.log(error);
            }
        }
        fetchData();
    }, [url_id])

    const styleForHeader = {
        backgroundImage: `url(${post.image})`
    };

  return (
      <>
      {isLoading &&
      <>
      <div className="story-detail-div" key={post.id}>
            <div className="story-header-div" style={styleForHeader} >
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