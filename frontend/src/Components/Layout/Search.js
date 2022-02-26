import React, {useEffect, useState} from 'react'  ;
import {useParams, Link} from 'react-router-dom';
import SearchIcon from '../../static/icons/search.svg';

export default function Search() {
    const [searchText, setSearchText] = useState("");
    const {search_value} = useParams();

    useEffect(() => {
        if(search_value){
            setSearchText(search_value);
        }
    }, [search_value])

    const handleSearchText = (event) => {
        setSearchText(event.target.value);
    }

    return (
        <div className="search-form-div">
            <form action={"/search/" + searchText} className="search-form">
                <button className="search-button">
                    <img src={SearchIcon} className="search-button-image" alt="" />
                </button>
            <input type="text" placeholder="Открыть для себя новое" value={searchText} onChange={handleSearchText} className="search-input" />
            </form>
        </div>
    )
}
