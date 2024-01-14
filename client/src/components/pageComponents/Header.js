import React from "react";
import PropTypes from "prop-types";
import {FaSearch} from "react-icons/fa";
import {MdLogout} from "react-icons/md";

import "./Header.scss"


const Header = ({logout}) => {

  return (
    <div className="header-wrapper">
      <div className="search-container">
        <div className="search-wrapper">


          <div className="m-glass">
            <FaSearch/>
          </div>
          <div className="search-field">
            <input type="text" placeholder="Поиск..."/>
          </div>


        </div>
      </div>

      <div className="logout-wrapper">
        <div className="logout-button">
          <MdLogout/>
        </div>
      </div>
    </div>
  );
}

Header.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default Header;
