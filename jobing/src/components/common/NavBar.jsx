import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NavLinks = ({ onClick }) => {
  const linkClasses = ({ isActive }) =>
    `block px-4 py-2 text-sm font-medium rounded cursor-pointer transition ${
      isActive
        ? "bg-[#fe8012] text-white"
        : "text-[#202a38] hover:bg-[#fe8012] hover:text-white"
    }`;

  const addVacanciesClasses =
    "block px-4 py-2 text-sm font-medium rounded cursor-pointer bg-[#fe8012] text-white";

  return (
    <>
      <NavLink to="/" end className={linkClasses} onClick={onClick}>
        Ana Səhifə
      </NavLink>
      <NavLink to="/vakansiyalar" className={linkClasses} onClick={onClick}>
        Vakansiyalar
      </NavLink>
      <NavLink to="/bloqlar" className={linkClasses} onClick={onClick}>
        Bloqlar
      </NavLink>
      <NavLink to="/elaqe" className={linkClasses} onClick={onClick}>
        Əlaqə
      </NavLink>
      <NavLink to="/haqqımızda" className={linkClasses} onClick={onClick}>
        Haqqımızda
      </NavLink>
      <NavLink to="/elan" className={addVacanciesClasses} onClick={onClick}>
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
        <div className="flex justify-end p-4">
          <button onClick={toggleNavbar}>
            <X />
          </button>
        </div>
        <div className="flex flex-col gap-4 px-6">
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
