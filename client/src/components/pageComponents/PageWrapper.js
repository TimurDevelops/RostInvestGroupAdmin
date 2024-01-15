import React from "react";
import PropTypes from "prop-types";

import Background from "./Background";
import Navbar from "./navbar/Navbar";
import Header from "./Header";

import "./PageWrapper.scss"


const PageWrapper = ({logout, children}) => {

  return (
    <Background>
      <div className="page-wrapper">
        <Navbar logout={logout}/>
        <div className="content-wrapper">
          <Header logout={logout}/>
          {children}
        </div>
      </div>

    </Background>
  );
}

PageWrapper.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default PageWrapper;
