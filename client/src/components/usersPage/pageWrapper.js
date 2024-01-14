import React from "react";
import PropTypes from "prop-types";

import Background from "../ui/Background";
import Navbar from "../ui/Navbar/Navbar";
import Header from "../ui/Header";

import "./usersPage.scss"


const PageWrapper = ({logout, setAlert}) => {

  return (
    <Background>
      <div className="page-wrapper">
        <Navbar logout={logout}/>
        <div className="content-wrapper">
          <Header logout={logout}/>

        </div>
      </div>

    </Background>
  );
}

PageWrapper.propTypes = {
  logout: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default PageWrapper;
