import React from "react";

import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav>
      <ul>
        <Link to="/">
          <li className="bg-orange-500">Ana Səhifə</li>
        </Link>
      </ul>
    </nav>
  );
};

export default NavBar;
