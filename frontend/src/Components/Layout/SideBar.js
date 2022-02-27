import {NavLink} from 'react-router-dom';
import React, {useEffect, useState} from 'react'

export default function SideBar() {
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    useEffect(()=> {
        const fetchData = async () => {
            try{
                const categories = await fetch("http://localhost:8000/api/v1/categories/").then(data => data.json());
                console.log(categories)
                setCategories(categories);
                setIsLoading(true);
            }catch(error){
                console.log(error);
            }
        }
        fetchData()
    }, [isLoading])

    const renderCatItems = () => {
        const listOfCategories = categories;
        return listOfCategories.map(item => (
            <NavLink to={"/category/" + item.url} className={"side-bar-category"} key={item.id}>{item.title}</NavLink>
        ))
    }

  return (
    <>
    {isLoading && (
    <div className="side-bar-div">
        <div className="stories-theme-div">
            <h4 className="stories-theme">Жанры</h4>
        </div>
        <div className="side-bar">
            {renderCatItems()}
        </div>
    </div>
    )}
    </>
  )
}
