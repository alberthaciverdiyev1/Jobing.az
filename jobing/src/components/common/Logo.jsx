import React from "react";
import logoSrc from "../../images/Jobing.az-Logo.png";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="h-60 w-60 flex items-center">
      <img src={logoSrc} alt="Jobing Logo" className="h-full w-full" />
    </Link>
  );
};

export default Logo;
