import React, { Component } from 'react'
import { MDBJumbotron, MDBContainer, MDBRow, MDBCol, MDBIcon } from "mdbreact";
import { AutoComplete } from "primereact/autocomplete";
import axios from "axios";
import { obce, starostovia } from "../obce";
import apiKey from "../config"
import { Animation } from "mdbreact";
const wtf = require("wtf_wikipedia");
const cheerio = require("cheerio");
const obceAStarostovia = [];
for (let i = 0; i < obce.length; i++) {
  let item = {
    meno: obce[i],
    starosta: starostovia[i]
  };
  obceAStarostovia.push(item);
}


export default class Main extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      data: "",
      suggestions: null,
      loading: false,
      finished: false,
    }
    this.handleGetImage = this.handleGetImage.bind(this);
    this.handleGeocoding = this.handleGeocoding.bind(this)
  }
   handleSelect(input) {
     this.setState({
       loading: true
     })
    if (obce.includes(input)) {
      this.setState({
        altQuery: input
      });
      wtf.fetch(input, "sk", (err, doc) => {
        if (err) {
          console.log(err);
        } else {
          try {
            this.setState({
              city: doc.infobox().data
            });
            console.log(this.state.city);
            this.handleGetImage();
            this.setState({
              loading: false,
              finished: true
            })
          } catch (e) {
            console.log(e);
            axios
              .get(
                `https://peaceful-oasis-31467.herokuapp.com/https://sk.wikipedia.org/wiki/Zoznam_slovensk%C3%BDch_obc%C3%AD_a_vojensk%C3%BDch_obvodov`
              )
              .then(res => {
                let $ = cheerio.load(res.data);
                let query = this.state.altQuery;
                console.log(query);
                let link;
                let allLinks = $("a").each(function(i, element) {
                  // Scrape only the text nodes
                  $(element)
                    .contents()
                    .each(function(i, element) {
                      if (element.type === "text" && element.data === query) {
                        link = $(element)
                          .parent()
                          .attr("href");
                        link = decodeURIComponent(link);
                        link = link.replace("/wiki/", "");
                        link = link.split("_").join(" ");
                      }
                    });
                });
                console.log(link);
                wtf.fetch(link, "sk", (err, doc) => {
                  if (err) {
                    console.log(err);
                  } else {
                    try {
                      this.setState({
                        city: doc.infobox().data
                      });
                      console.log(this.state.city);
                      this.handleGetImage();
                      this.setState({
                        loading: false,
                        finished: true
                      })
                    } catch (e) {
                      console.log(e);
                      alert("Uvedenú obec nebolo možné nájsť");
                    }
                  }
                });
              });
          }
        }
      });
    } else {
      let item = obceAStarostovia.find(item => item.starosta === input);
      console.log(item.meno);
      this.setState({
        altQuery: item.meno
      });
      wtf.fetch(item.meno, "sk", (err, doc) => {
        if (err) {
          console.log(err);
        } else {
          try {
            this.setState({
              city: doc.infobox().data
            });
            console.log(this.state.city);
            this.handleGetImage();
            this.setState({
              loading: false,
              finished: true,
            })
          } catch (e) {
            axios
              .get(
                `https://peaceful-oasis-31467.herokuapp.com/https://sk.wikipedia.org/wiki/Zoznam_slovensk%C3%BDch_obc%C3%AD_a_vojensk%C3%BDch_obvodov`
              )
              .then(res => {
                let $ = cheerio.load(res.data);
                let query = this.state.altQuery;
                console.log(query);
                let link;
                let allLinks = $("a").each(function(i, element) {
                  // Scrape only the text nodes
                  $(element)
                    .contents()
                    .each(function(i, element) {
                      if (element.type === "text" && element.data === query) {
                        link = $(element)
                          .parent()
                          .attr("href");
                        link = decodeURIComponent(link);
                        link = link.replace("/wiki/", "");
                        link = link.split("_").join(" ");
                      }
                    });
                });
                wtf.fetch(link, "sk", (err, doc) => {
                  if (err) {
                    console.log(err);
                  } else {
                    try {
                      this.setState({
                        city: doc.infobox().data
                      });
                      console.log(this.state.city);
                      this.handleGetImage();
                      this.setState({
                        loading: false,
                        finished: true,
                      })
                    } catch (e) {
                      console.log(e);
                      alert("Uvedenú obec nebolo možné nájsť");
                    }
                  }
                });
              });
          }
        }
      });
    }
  }
  handleGetImage() {
    let param;
    if (this.state.city.názov) {
      param = this.state.city.názov.data.text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    } else if (this.state.city.name) {
      param = this.state.city.name.data.text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    }
    this.handleGeocoding(param)
    axios
      .get(
        `https://peaceful-oasis-31467.herokuapp.com/https://www.e-obce.sk/obec/${param.replace(
          /[^A-Z0-9]/gi,
          ""
        )}/${param.replace(/[\s-]+/g, "-")}.html`
      )
      .then(res => {
        let $ = cheerio.load(res.data);
        this.setState({
          img: $("td[width=84]")
            .children("img")
            .attr("src")
        });
      })
      .catch(e => console.log(e));
    if (param.includes("bratislava") || param.includes("kosice") || param.includes("ordzovany")) {
      param = param
        .split(" ")
        .join("")
        .split("–")
        .join("");
      param = param.replace("–", "");
      console.log(param);
      this.setState({
        altImg: param
      });
    }
  }
  handleSuggest(event) {
    const suggestions = [...obce, ...starostovia];
    let results = suggestions.filter(obec => {
      return obec.toLowerCase().startsWith(event.query.toLowerCase());
    });

    this.setState({ suggestions: results });
  }
  handleGeocoding(input){
    axios.get(`https://api.tomtom.com/search/2/geocode/${input}.JSON?key=${apiKey}`).then(res => {
      console.log(res)
      this.setState({
        lat: res.data.results[0].position.lat,
        lon: res.data.results[0].position.lon
      })
    }).catch(e => console.log(e))
  }

  
  
  render() {
   
    return (
      <div id={this.state.finished === false ? "main" : "main--details"} className="pt-5 pb-5 ">
      <MDBContainer className="mt-2 text-center">    
        <MDBRow>
          <MDBCol>
            {this.state.finished === false ? 
            <Animation type="slideInLeft">
            <MDBJumbotron  className="d-flex justify-content-center align-items-center">
              <h2 className="h1 display-3">Vyhľadať v databáze obcí</h2>
              {this.state.loading ?   <div className="loader display-3 align-baseline"></div> : 
              <AutoComplete
              id="autocomplete"
              value={this.state.data}
              onChange={e => this.setState({ data: e.value })}
              suggestions={this.state.suggestions}
              completeMethod={this.handleSuggest.bind(this)}
              onSelect={e => this.handleSelect(e.value)}    
              placeholder="Zadajte názov"   
                     
              />      }
            </MDBJumbotron></Animation> :
            <Animation type="slideInRight">
            <div>
            <h1 className="main_heading--details">    <button className="main_heading_button--details" onClick={() => this.setState({finished: false, data: ""})}><MDBIcon icon="backward" /></button> Detail obce</h1>
           
            <div className="container"></div>
            <MDBJumbotron fluid>         
            
              <MDBRow className="main_leftbox_row--details">
                <MDBCol>
               <div className="main_leftbox--details">
               <div className="container">
                <MDBRow >
                  <MDBCol xl="3" lg="6" sm="6" xs="6" className="main_labels mt-5">
                <p className="text-left font-weight-bold">{this.state.city.mayor || this.state.city.starosta? "Meno starostu:": ""}</p>
                <p className="text-left font-weight-bold">{this.state.city.free1 || this.state.city.adresa? "Adresa obecného úradu:": ""} </p>
                <p className="text-left font-weight-bold">{this.state.city.free2 || this.state.city.telefón? "Telefón:": ""} </p>
                <p className="text-left font-weight-bold">{this.state.city.free3 || this.state.city.fax? "Fax:": ""} </p>
                <p className="text-left font-weight-bold">{this.state.city.free4 || this.state.city["e-mail"]? "E-mail:": ""} </p>
                <p className="text-left font-weight-bold">{this.state.city.website || this.state.city.web? "Web:": ""}  </p>
                <p className="text-left font-weight-bold">Zemepisné súradnice: </p>
                
              
                </MDBCol>
                <MDBCol  xl="4" lg="6" sm="6" xs="6"  className="main_values mt-5">
                {this.state.city && this.state.city.name ? 
                <div className="main_leftbox--details">
                <p className="text-left">{this.state.city.mayor ? this.state.city.mayor.data.text : ""} </p>
                <p className="text-left">{this.state.city.free1 ? this.state.city.free1.data.text : ""} </p>
                <p className="text-left">{this.state.city.free2 ? this.state.city.free2.data.text : ""} </p>
                <p className="text-left">{this.state.city.free3 ? this.state.city.free3.data.text : ""} </p>
                <p className="text-left">{this.state.city.free4 ? this.state.city.free4.data.text : ""} </p>
                <p className="text-left">{this.state.city.website.data.links[0].site} </p>
                <p className="text-left">{this.state.lat},{this.state.lon} </p>
                </div>
                : 
                <div className="main_leftbox--details">
                <p className="text-left">{this.state.city.starosta ? this.state.city.starosta.data.text : ""} </p>
                <p className="text-left"> {this.state.city.adresa ? this.state.city.adresa.data.text : ""} </p>
                <p className="text-left"> {this.state.city.telefón ? this.state.city.telefón.data.text : ""} </p>
                <p className="text-left">{this.state.city.fax ? this.state.city.fax.data.text : ""}</p>
                <p className="text-left">{this.state.city["e-mail"]? this.state.city["e-mail"].data.text : ""}</p>
                <p className="text-left">{this.state.city.web ? this.state.city.web.data.text : ""}</p>
                <p className="text-left">{this.state.lat},{this.state.lon} </p>
                </div> }
                </MDBCol>
                </MDBRow>
                </div>
                
                </div>
                </MDBCol>
                <MDBCol lg="6" xs="12">                               
                <div className="main_rightbox--details d-flex  flex-column justify-content-center align-items-center ">
                {this.state.img || this.state.altImg ? (<img alt="erb"src={this.state.img? this.state.img: window.location.origin +"/erbyBAKEMC/" +  this.state.altImg +  ".gif"}/>)
                 : (undefined)}
                 <h1 className="blue-text mt-4 font-weight-bold">{this.state.city.name ? this.state.city.name.data.text : this.state.city.názov.data.text}</h1>
                </div>
                </MDBCol>
                </MDBRow>
               
          </MDBJumbotron></div></Animation>}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      </div>
    )
  }
}
