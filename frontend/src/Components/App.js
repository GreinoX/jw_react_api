import '../styles/App.css';
import React, {Component} from 'react';
import Header from './Layout/Header';
import Footer from './Layout/Footer';
import MainContent from './MainContent';
import MainContentByCategory from './MainContentByCategory';
import Stories from './Layout/Stories';
import {Routes, Route } from 'react-router-dom';
import Story from './Layout/Story';
import Authentication from './Layout/Authentication';


class App extends Component {

  render(){
    return (
    <>
    <Header />
    <Routes>
      <Route path="/" element={<MainContent/>} exact>
        <Route path="/quotes" element={<Stories/>} />
        <Route path="/story/:url_id" element={<Story/>}/>
        <Route path="/category/:url_id" element={<MainContentByCategory/>}/>
      </Route>
      <Route path="/auth" element={<Authentication/>}/>
    </Routes>
    <hr />
    <Footer />
    </>
    )
  }

}

export default App;
