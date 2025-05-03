import React from "react";

import { Link } from "react-router-dom";

// Images
import Logo from "../../images/Jobing.az-Logo.png"

const Header = () => {
  return (
    <header>
      <div>
        <Link to="/">
            <img src={Logo} alt="logo" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
