import React from "react";

import { Link } from "react-router-dom";

// Components
import Container from "./Container";
import NavBar from "./NavBar";

// Images
import Logo from "../../images/Jobing.az-Logo.png";

const Header = () => {
  return (
    <header className="w-full py-2 px-4 sticky">
      <Container>
        <div className="flex justify-between items-center h-20">
          <div className="w-48">
            <Link to="/">
              <img
                src={Logo}
                alt="logo"
                className="w-auto object-contain"
              />
            </Link>
          </div>
          <NavBar />
        </div>
      </Container>
    </header>
  );
};

export default Header;
