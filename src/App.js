import React from "react";
import {Container } from 'mdbreact';
import Nav from "./components/Nav";
import Main from "./components/Main";
import FooterPage from "./components/Footer";


 const App = () =>{
    return (     
        <Container fluid>
        <Nav/>
        <Main/>     
        <FooterPage/>
        </Container>      
    );
  }


export default App;
