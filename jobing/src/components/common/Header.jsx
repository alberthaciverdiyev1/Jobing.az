import React from "react";

import { Link } from "react-router-dom";

// Components
import Container from "./Container";
import NavBar from "./NavBar";

// Images
import Logo from "../../images/Jobing.az-Logo.png";

const Header = () => {
  return (
    <header className="w-full py-5 px-12">
      <Container>
        <div className="flex">
          <div>
            <Link to="/">
              <img src={Logo} alt="logo" />
            </Link>
          </div>
          <NavBar />
        </div>
      </Container>
    </header>
  );
};

export default Header;
