import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {formatIntegers, imageForStory} from './utils';
import Like from '../static/icons/minimalistic_like.svg';
import View from '../static/icons/views.svg';
import SideBar from './Layout/SideBar';


function MainContentByCategory() {
    const {url_id} = useParams();
    const [listOfPost, setListOfPost] = useState([]);
    const [category, setCategory] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch(`http://localhost:8000/api/v1/category/${url_id}`).then(res => res.json());
                if(response.length !== 0){
                    setListOfPost(response);
                    setCategory(response[0].category.title);
                }else{
                    setListOfPost([]);
                    setCategory("Напишите первую историю в этом жанре!");
                }
            }catch(error){
                console.log(error);
            }
        }
        fetchData();
    }, [url_id]);

    const renderItems = () => {
        return listOfPost.map(item => (
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
        ))
    };

  return (
    <>
    <div className="main">
    <div className="stories-st-theme-div">
        <div className="stories-theme-div">
            <h4 className="stories-theme">{category}</h4>
        </div>
        <div className="stories">
            {renderItems()}
        </div>
    </div>
    <SideBar/>
    </div>
    </>
  );
}

export default MainContentByCategory;