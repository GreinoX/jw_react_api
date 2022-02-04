import React from 'react'
import {Link} from 'react-router-dom'

function Header(props){
    return (
        <div className="header">
            <div className="header-div">
                <div className="header-logo-div">
                    <Link to="/" className="header-logo">ПростоПиши</Link>
                </div>
                <div className="menu-div">
                    <nav>
                        <Link to="/" className="menu-link">Истории</Link>
                        <Link to="/quotes" className="menu-link">Рецензии</Link>
                        <Link to="/about" className="menu-link">Инфо</Link>
                        <Link to="/auth" className="menu-link enter">Войти</Link>
                    </nav>
                </div>
            </div>
            <hr />
        </div>
    )
}

export default Header;
