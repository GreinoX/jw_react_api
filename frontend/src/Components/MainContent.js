import React, { Component } from 'react';
import SideBar from './Layout/SideBar'
import Like from '../static/icons/minimalistic_like.svg'
import View from '../static/icons/views.svg'
import {Link} from 'react-router-dom';
import {formatIntegers, imageForStory} from './utils'

class MainContent extends Component {
    constructor(props){
        super(props);
        this.state = {
          stories: [],
          categories: [],
          placeholder: ""
        };
      }


    async componentDidMount(){
        try{
            const stories = await fetch("http://localhost:8000/api/v1/").then(res => res.json());
            const categories = await fetch("http://localhost:8000/api/v1/categories/").then(res => res.json());
            this.setState({
            stories,
            categories
            });
        } catch(error){
            console.log(error);
        }
    }

    renderItems = () => {
        const listOfStories = this.state.stories;
        
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

    render(){
        return (
        <>  
        <div className="main">
            <div className="stories-st-theme-div">
                <div className="stories-theme-div">
                <h4 className="stories-theme">Новое</h4>
                </div>
                <div className="stories">
                {this.renderItems()}
                </div>
            </div>
            <SideBar/>
            </div>
        </>
        )
        }
}

export default MainContent;