import React, { Component } from 'react';
import { Navbar, NavbarBrand, NavbarNav, NavItem, NavbarToggler, Collapse, Dropdown, DropdownToggle, DropdownMenu,  DropdownItem, Container, Row, Col, Fa,} from "mdbreact";

class Nav extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       isOpen: false
    }
  }  
 

toggleCollapse = () =>{
   this.setState({ isOpen: !this.state.isOpen });}

  render() {
    return (
      <Navbar color="white" light expand="md">
      <Container >
        <Row className="navbar_row">
          <Col lg="12" xs="12">
          <Row>
            <Col xs="12">
      <NavbarBrand>
        <img src={window.location + "logo.png"} alt="logo" className="navbar_img"/>
      </NavbarBrand>
      <NavbarToggler
        onClick={this.toggleCollapse}
      />      
      </Col>

      <Col lg="4" xs="12" className="float-right col_margin">
      
        <a id="kontakty" className="font-weight-bold blue-text text-center">Kontakty a čísla na oddelenia</a>
        
        <Dropdown className="navbar_language grey-text">
              <DropdownToggle nav caret>
                <div className="d-md-inline grey-text">EN</div>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem href="#!">SK</DropdownItem>
                <DropdownItem href="#!">CZ</DropdownItem>
                <DropdownItem href="#!">DE</DropdownItem>
                <DropdownItem href="#!">FR</DropdownItem>
              </DropdownMenu>
            </Dropdown>
        
            </Col>
            <Col  lg="4" xs="12" className="col_margin--input">

            <div className="input-group search form-sm form-1 pl-0">         
          <input
            className="form-control search my-0 py-1"
            type="text"           
            aria-label="Search"/>              
            <button className="nav_search_button"><Fa className="text-gray nav_search_icon" icon="search"></Fa></button>  
            </div>
            </Col>
            <Col lg="4" xs="12" className="mt-3">
            <button className="btn" id="nav_login_button">Prihlásenie</button>
      
       </Col>
       </Row>
     </Col>
     <Col lg="12"  className='nav_megamenu'>
      <Collapse
        id="navbarCollapse3"
        isOpen={this.state.isOpen}
        navbar
      >
        <NavbarNav left>       
          <NavItem>
            <Dropdown>
              <DropdownToggle nav>
                <div className="d-md-inline nav_megamenu_item">O nás</div>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem href="#!">Action</DropdownItem>
                <DropdownItem href="#!">Another Action</DropdownItem>
                <DropdownItem href="#!">Something else here</DropdownItem>
                <DropdownItem href="#!">Something else here</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavItem>
          <NavItem>
            <Dropdown>
              <DropdownToggle nav>
                <div className="d-md-inline nav_megamenu_item">Zoznam miest</div>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem href="#!">Action</DropdownItem>
                <DropdownItem href="#!">Another Action</DropdownItem>
                <DropdownItem href="#!">Something else here</DropdownItem>
                <DropdownItem href="#!">Something else here</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavItem>
          <NavItem>
            <Dropdown>
              <DropdownToggle nav>
                <div className=" d-md-inline nav_megamenu_item">Inšpekcia</div>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem href="#!">Action</DropdownItem>
                <DropdownItem href="#!">Another Action</DropdownItem>
                <DropdownItem href="#!">Something else here</DropdownItem>
                <DropdownItem href="#!">Something else here</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavItem>
          <NavItem>
            <Dropdown>
              <DropdownToggle nav>
                <div className=" d-md-inline nav_megamenu_item">Kontakt</div>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem href="#!">Action</DropdownItem>
                <DropdownItem href="#!">Another Action</DropdownItem>
                <DropdownItem href="#!">Something else here</DropdownItem>
                <DropdownItem href="#!">Something else here</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavItem>
        </NavbarNav>       
      </Collapse>
      </Col>
      </Row>
      </Container>
      
  </Navbar>
    );
  }
}
export default Nav



