import React, {useEffect, useState} from 'react';
import SideBar from './Layout/SideBar';
import Like from '../static/icons/minimalistic_like.svg';
import View from '../static/icons/views.svg';
import {Link} from 'react-router-dom';
import {formatIntegers, imageForStory} from './utils'; 
import Search from './Layout/Search';

export default function MainContent() {
    const [stories, setStories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [fetching, setFetching] = useState(true);
    const [count, setCount] = useState(0)

    useEffect(() => {
        document.title = "Просто Пиши"
        const fetchData = async () => {
            try{
                const response = await fetch(`http://localhost:8000/api/v1/?p=${page}&page_size=${6}`)
                .then(res => res.json())
                .then(data => {
                    setStories( [...stories, ...data.results]);
                    setIsLoading(true);
                    setCount(data.count);
                    setPage(prevState => prevState + 1)
                }).finally(() => {
                    setFetching(false);
                })
            }catch(e){
                console.log(e)
            }
        }
        fetchData()
    }, [fetching])


    useEffect(() => {
        document.addEventListener('scroll', scrollHanlder);
        return function(){
            document.removeEventListener('scroll', scrollHanlder);
        }
    })

    const scrollHanlder = (e) => {
        if(e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100 && stories.length !== count){
            setFetching(true); 
        }
    }

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
    ))}

  return (
    <>
    {isLoading && (
    <>
        <div className="stories-st-theme-div">
            <div className="stories-theme-div">
                <h4 className="stories-theme">Новое</h4>
                <Search />
            </div>
            <div className="stories">
            {renderItems()}
            </div>
        </div>
        <SideBar/>
    </>
    )}
    </>
  )
}
