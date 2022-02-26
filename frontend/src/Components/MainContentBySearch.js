import React, {useEffect, useState} from 'react'
import {useParams, Link} from 'react-router-dom';
import Search from './Layout/Search';
import SearchIcon from '../static/icons/search.svg';
import Like from '../static/icons/minimalistic_like.svg';
import View from '../static/icons/views.svg';
import SideBar from './Layout/SideBar';
import { formatIntegers, imageForStory } from './utils';

export default function MainContentBySearch() {
    const {search_value} = useParams();
    const [searchText, setSearchText] = useState("");
    const [stories, setStories] = useState([]);

    useEffect(() => {
        if(search_value.trim() !== ""){
            const fetchData = async () => {
                try{
                    const response = await fetch(`http://localhost:8000/api/v1/story/search/${search_value}`)
                    .then(res => res.json())
                    .then(data => {
                        setStories(data);
                        setSearchText(search_value);
                    })
                }catch(error){
                    console.log(error)
                }
            }
            fetchData();
        }
    }, [search_value])

    const handleSearchText = (event) => {
        setSearchText(event.target.value)
    }

    const renderItems = () => {
        const listOfPost = stories;
        if(!stories.length){
            return (
                <>
                <div className="story">
                    <div className="black" style={{background: "linear-gradient(180deg, rgba(12, 12, 14, 0.83) 0%, rgba(255, 255, 255, 0) 121%)", backgroundColor: "none"}}></div>
                    <div className="story-title-div">
                        <h3 className="story-title">По вашему запросу ничего не найденно</h3>
                    </div>
                </div>
                <div className="story">
                    <div className="black" style={{background: "linear-gradient(180deg, rgba(12, 12, 14, 0.83) 0%, rgba(255, 255, 255, 0) 121%)", opacity: "0.4"}}></div>
                </div>
                <div className="story">
                    <div className="black" style={{background: "linear-gradient(180deg, rgba(12, 12, 14, 0.83) 0%, rgba(255, 255, 255, 0) 121%)", opacity: "0.1"}}></div>
                </div>
                </>
            )
        }
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
    <div className="stories-st-theme-div">
            <div className="stories-theme-div">
                <h4 className="stories-theme">Поиск</h4>
                <Search/>
            </div>
            <div className="stories">
                {stories && (
                    renderItems()
                )}
            </div>
        </div>
        <SideBar/>
    </>
  )
}
