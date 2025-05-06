import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

import logoSrc from "../../images/Jobing.az-Logo.png";

import {
  Home,
  Briefcase,
  BookOpen,
  Info,
  Mail,
  PlusSquare,
} from "lucide-react";

const NavLinks = ({ onClick }) => {
  const linkClasses = ({ isActive }) =>
    `w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded transition whitespace-nowrap ${
      isActive
        ? "bg-[#fe8012] text-white"
        : "text-[#202a38] hover:bg-[#fe8012] hover:text-white"
    }`;

  const addVacanciesClasses =
    "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded bg-[#fe8012] text-white whitespace-nowrap";

    const iconClasses = "md:hidden"
  return (
    <>
      <NavLink to="/" end className={linkClasses} onClick={onClick}>
        <Home size={18} className={iconClasses} />
        Ana Səhifə
      </NavLink>
      <NavLink to="/vakansiyalar" className={linkClasses} onClick={onClick}>
        <Briefcase size={18} className={iconClasses} />
        Vakansiyalar
      </NavLink>
      <NavLink to="/bloqlar" className={linkClasses} onClick={onClick}>
        <BookOpen size={18} className={iconClasses} />
        Bloqlar
      </NavLink>
      <NavLink to="/haqqımızda" className={linkClasses} onClick={onClick}>
        <Info size={18} className={iconClasses} />
        Haqqımızda
      </NavLink>
      <NavLink to="/elaqe" className={linkClasses} onClick={onClick}>
        <Mail size={18} className={iconClasses} />
        Əlaqə
      </NavLink>
      <NavLink to="/elan" className={addVacanciesClasses} onClick={onClick}>
        <PlusSquare size={18} className={iconClasses} />
        Elan Yerləşdir
      </NavLink>
    </>
  );
};

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <nav className="w-full flex justify-end items-center relative">
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4">
          <NavLinks />
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={toggleNavbar}>{isOpen ? <X /> : <Menu />}</button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {/* <img
            width={200}
            height={200}
            src={logoSrc}
            alt="Jobing Logo"
            className=""
          /> */}
          <button onClick={toggleNavbar}>
            <X />
          </button>
        </div>

        <div className="flex flex-col gap-2 md:px-2 py-4">
          <NavLinks onClick={closeMenu} />
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}
    </>
  );
};

export default Nav;
