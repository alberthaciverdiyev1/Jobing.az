import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const linkClasses = ({ isActive }) =>
    `block px-4 py-2 text-sm font-medium rounded cursor-pointer ${
      isActive
        ? "bg-[#fe8012] text-white"
        : "text-[#202a38] hover:bg-[#fe8012] hover:text-white"
    }`;

  return (
    <nav className="flex items-center justify-center">
      <ul className="flex gap-8">
        <li>
          <NavLink to="/" end className={linkClasses}>
            Ana Səhifə
          </NavLink>
        </li>
        <li>
          <NavLink to="/vakansiyalar" className={linkClasses}>
            Vakansiyalar
          </NavLink>
        </li>
        <li>
          <NavLink to="/bloqlar" className={linkClasses}>
            Bloqlar
          </NavLink>
        </li>
        <li>
          <NavLink to="/elaqe" className={linkClasses}>
            Əlaqə
          </NavLink>
        </li>
        <li>
          <NavLink to="/haqqımızda" className={linkClasses}>
            Haqqımızda
          </NavLink>
        </li>
        <li>
          <NavLink to="/elan" className={linkClasses}>
            Elan Yerləşdir
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
