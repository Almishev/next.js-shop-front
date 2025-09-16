import Link from "next/link";
import styled from "styled-components";
import Center from "@/components/Center";
import {useContext, useEffect, useState} from "react";
import {CartContext} from "@/components/CartContext";
import BarsIcon from "@/components/icons/Bars";

const StyledHeader = styled.header`
  background-color: #222;
`;
const Logo = styled(Link)`
  color:#fff;
  text-decoration:none;
  position: relative;
  z-index: 3;
`;
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
`;
const StyledNav = styled.nav`
  ${props => props.mobileNavActive ? `
    display: block;
  ` : `
    display: none;
  `}
  gap: 15px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 70px 20px 20px;
  background-color: #222;
  z-index: 9999; /* над всичко */
  overflow-y: auto;
  @media screen and (min-width: 768px) {
    display: flex;
    position: static;
    padding: 0;
  }
`;
const NavLink = styled(Link)`
  display: block;
  color:#aaa;
  text-decoration:none;
  padding: 10px 0;
  @media screen and (min-width: 768px) {
    padding:0;
  }
`;
const NavButton = styled.button`
  background-color: transparent;
  width: 30px;
  height: 30px;
  border:0;
  color: white;
  cursor: pointer;
  ${props => props.mobileOpen ? `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
  ` : `
    position: relative;
    z-index: 3;
  `}
  @media screen and (min-width: 768px) {
    display: none;
  }
`;


export default function Header() {
  const {cartProducts} = useContext(CartContext);
  const [mobileNavActive,setMobileNavActive] = useState(false);
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('menu-open', mobileNavActive);
    }
  }, [mobileNavActive]);
  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href={'/'}>Artisan Jewelry</Logo>
          <StyledNav className={mobileNavActive ? 'mobile-nav' : ''} mobileNavActive={mobileNavActive}>
            <NavLink href={'/'}>Начало</NavLink>
            <NavLink href={'/products'}>Всички продукти</NavLink>
            <NavLink href={'/categories'}>Категории</NavLink>
            <NavLink href={'/account'}>Акаунт</NavLink>
            <NavLink href={'/cart'}>Кошница ({cartProducts.length})</NavLink>
          </StyledNav>
          <NavButton className="nav-toggle" mobileOpen={mobileNavActive} onClick={() => setMobileNavActive(prev => !prev)}>
            <BarsIcon />
          </NavButton>
        </Wrapper>
      </Center>
    </StyledHeader>
  );
}