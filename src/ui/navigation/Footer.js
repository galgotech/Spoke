import React, { Component } from "react";
import styled from "styled-components";

const StyledFooter = styled.footer`
  display: flex;
  margin: 24px 0;
  font-size: 1.4em;

  a {
    text-decoration: none;
    display: flex;
  }

  nav {
    width: 100%;
  }

  @media (min-width: 600px) {
    justify-content: flex-end;

    nav {
      width: auto;
    }
  }
`;

const NavList = styled.ul`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: flex-end;

  @media (min-width: 600px) {
    flex-direction: row;
    align-items: flex-end;
  }
`;

export default class Footer extends Component {
  render() {
    return (
      <StyledFooter>
        <nav>
          <NavList></NavList>
        </nav>
      </StyledFooter>
    );
  }
}
