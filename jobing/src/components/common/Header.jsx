import React from "react";
import Container from "./Container";
import Nav from "./NavBar";
import Logo from "../../components/common/Logo";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full pr-4 shadow-[0_4px_4px_-4px_rgba(0,0,0,0.4)]">
      <Container>
        <div className="flex items-center justify-between h-20">
          <Logo />
          <Nav />
        </div>
      </Container>
    </header>
  );
};

export default Header;
