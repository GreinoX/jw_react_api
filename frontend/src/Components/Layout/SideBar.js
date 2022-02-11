import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';

class SideBar extends Component{
    constructor(props){
        super(props);
        this.state = {
            categories: [],
            isLoading: false
        };
    }

    async componentDidMount(){
        try{
            let categories = await fetch("http://localhost:8000/api/v1/categories").then(data => data.json());
            this.setState({categories,
            isLoading: true});
        }catch(error){
            console.log(error);
        }
    }

    renderCatItems = () => {
        let listOfCategories = this.state.categories;
        return listOfCategories.map(item => (
            <NavLink to={"/category/" + item.url} className={"side-bar-category"} key={item.id}>{item.title}</NavLink>
        ))
    }

    render(){
        return (
            <>
            {this.state.isLoading && 
            <div className="side-bar-div">
                <div className="stories-theme-div">
                    <h4 className="stories-theme">Жанры</h4>
                </div>
                <div className="side-bar">
                    {this.renderCatItems()}
                </div>
            </div>
            }
            </>
            );
    }

}

export default SideBar;
