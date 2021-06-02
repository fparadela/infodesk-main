import React from "react";
import Header from '../../components/Header/Header'
import Baner from '../../components/Baner/Baner'
import {Main, Hr} from './styled'
import Section from './Section1'
import Footer from '../../components/Footer/Footer'
import Realible from '../../components/Reliable/Reliable'
const HomePage = () => {

  return <Main>
  <Header/>
  <Baner/>
  <Section/>
  <Realible/>
  <Hr/>
  <Footer/>
  </Main>
};

export default HomePage;
