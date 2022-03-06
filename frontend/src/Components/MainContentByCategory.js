import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Link} from 'react-router-dom';
import {formatIntegers, imageForStory} from './utils';
import Like from '../static/icons/minimalistic_like.svg';
import View from '../static/icons/views.svg';
import SideBar from './Layout/SideBar';


function MainContentByCategory() {
    const {url_id} = useParams();
    const [stories, setStories] = useState([]);
    const [category, setCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);

    useEffect(() => {
        setPage(1);
        setStories([]);
        setCategory("");
        setFetching(true);
        setCount(0);
    }, [url_id])

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await fetch(`http://localhost:8000/api/v1/category/${url_id}?p=${page}&page_size=6`)
                .then(res => res.json())
                .then(data => {
                    if(data.count !== 0){
                        if(page === 1){
                            setCategory(data.results[0].category.title);
                            document.title = `Просто Пиши | ${data.results[0].category.title}`;
                        }
                        setStories([...stories, ...data.results]);
                        setCount(data.count);
                        setPage(prevState => prevState + 1);
                        setIsLoading(true);
                    }else{
                        setStories([]);
                        setCategory("Никто еще не писал в таком жанре");
                        setIsLoading(true);
                        document.title = "Просто Пиши | Жанр пуст"
                    }
                }).finally(() => {
                    setFetching(false);
                })
            }catch(error){
                console.log(error);
            }
        }
        fetchData();
    }, [fetching]);

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
        return stories.map(item => (
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
    {isLoading && 
    <>
    <div className="stories-st-theme-div">
        <div className="stories-theme-div">
            <h4 className="stories-theme">{category}</h4>
        </div>
        <div className="stories">
            {renderItems()}
            {stories.length === 0 && (
                <>
                <div className="story">
                    <div className="black" style={{background: "linear-gradient(180deg, rgba(12, 12, 14, 0.83) 0%, rgba(255, 255, 255, 0) 121%)", backgroundColor: "none"}}></div>
                    <div className="story-title-div">
                        <h3 className="story-title">В данном жанре пока что ничего нет</h3>
                    </div>
                </div>
                <div className="story">
                    <div className="black" style={{background: "linear-gradient(180deg, rgba(12, 12, 14, 0.83) 0%, rgba(255, 255, 255, 0) 121%)", opacity: "1"}}></div>
                </div>
                <div className="story">
                    <div className="black" style={{background: "linear-gradient(180deg, rgba(12, 12, 14, 0.83) 0%, rgba(255, 255, 255, 0) 121%)", opacity: "1"}}></div>
                </div>
                </>
            )}
        </div>
    </div>
    <SideBar/>
    </>
    }
    </>
  );
}

export default MainContentByCategory;