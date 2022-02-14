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
import Registration from './Layout/Registration';
import Profile from './Layout/Profile';
import CreateStory from './Layout/CreateStory';
import EditProfile from './Layout/EditProfile';
import EditStory from './Layout/EditStory';

class App extends Component {

  render(){
    return (
    <>
    <Header />
    <div className="main">
      <Routes>
        <Route path="/" element={<MainContent/>} exact />
        <Route path="/quotes" element={<Stories/>} />
        <Route path="/story/:url_id" element={<Story/>}/>
        <Route path="/category/:url_id" element={<MainContentByCategory/>}/>
        <Route path="/login/" element={<Authentication/>}/>
        <Route path="/registration/" element={<Registration/>}/>
        <Route path="/profile/:username" element={<Profile/>} />
        <Route path="/story/create/" exact element={<CreateStory/>} />
        <Route path="/profile/edit/" exact element={<EditProfile/>}/>
        <Route path="/story/edit/:url_id" exact element={<EditStory/>}/>
      </Routes>
    </div>
    <Footer />
    </>
    )
  }

}

export default App;
