import React from "react";
import PropTypes from "prop-types";
import {FaSearch} from "react-icons/fa";
import {MdLogout} from "react-icons/md";
import { CgProfile } from "react-icons/cg";

import "./Header.scss"
import {Link} from "react-router-dom";


const Header = ({logout}) => {

  return (
    <div className="header-wrapper">
      <div className="search-container">
        <div className="search-wrapper">


          <div className="m-glass">
            <FaSearch/>
          </div>
          <div className="search-field">
            <input id="search-field" type="text" placeholder="Поиск..."/>
          </div>


        </div>
      </div>

      <div className="logout-wrapper">
        <Link to={"/edit-profile"}>
          <div className="header-button edit-profile-button">
            <CgProfile/>
          </div>
        </Link>
        <div className="header-button logout-button" onClick={() => logout()}>
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
