import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import HomePage from "../screens/HomePage/HomePage";
import AboutPage from "../screens/AboutPage/AboutPage";
import VideoPage from "../screens/VideoPage/VideoPage";
import VideosPage from "../screens/VideosPage/VideosPage";
import FindPage from "../screens/FindPage/FindPage"
import LoginPage from "../screens/LoginPage/LoginPage"
import SingUpPage from '../screens/SingUpPage/SingUpPage'
import StoryPage from '../screens/StoryPage/StoryPage'
import AccountPage from '../screens/AccountPage/AccountPage'
const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>  
        <Route exact path="/login">
          <LoginPage />
        </Route> 
        <Route exact path="/singUp">
          <SingUpPage />
        </Route>
        <Route exact path="/about">
          <AboutPage />
        </Route>
        <Route exact path="/find">
          <FindPage />
        </Route>
        <Route exact path="/videos">
          <VideosPage />
        </Route>  
        <Route exact path="/stories">
          <StoryPage />
        </Route>
        <Route exact path="/account">
          <AccountPage/>
        </Route>
        <Route path="/videos/:id">
          <VideoPage />
        </Route> 
         
        <Route>
         <div>
           Pagina não encontrada
         </div>
        </Route>      
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
