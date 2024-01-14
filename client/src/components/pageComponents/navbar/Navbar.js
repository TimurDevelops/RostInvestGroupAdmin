import React from "react";

import NavbarElement from "./NavbarElement";

import "./Navbar.scss"
import {string} from "prop-types";


const Navbar = () => {

  // TODO call to retrieve the shit
  const data = [{
    title: "Categories",
    list: ["Categories", "Edit", "View", "Navigate"]
  }, {
    title: "Edit",
    list: ["Categories", "Navigate", "Edit", "View"]
  }, {
    title: "Navigate",
    list: ["Categories", "View", "Navigate", "Edit"]
  }, {
    title: "Help",
    list: ["Categories", "Edit", "View", "Navigate"]
  }, {
    title: "File",
    list: ["Navigate", "Categories", "Edit", "View"]
  }, {
    title: "File",
    list: [{
      title: "Categories",
      list: ["Categories", "Edit", "View", "Navigate"]
    }, {
      title: "Edit",
      list: ["Categories", "Navigate", "Edit", "View"]
    }, {
      title: "Navigate",
      list: ["Categories", "View", "Navigate", "Edit"]
    }]
  }, {
    title: "Categories",
    list: ["Categories", "Edit", "Navigate"]
  }, {
    title: "Edit",
    list: ["Categories", "Navigate", "Edit", "View"]
  }, {
    title: "Navigate",
    list: ["Categories", "View", "Navigate", "Edit"]
  }, {
    title: "Help",
    list: ["Categories", "Edit", "Navigate"]
  }, {
    title: "File",
    list: ["Navigate", "Categories"]
  }, {
    title: "Categories",
    list: ["Categories", "Edit", "View", "Navigate", "Edit", "View", "Navigate"]
  }, {
    title: "Edit",
    list: ["Categories", "Navigate", "Edit", "View"]
  }, {
    title: "Navigate",
    list: ["Categories", "View", "Navigate", "Edit", "Navigate", "Edit", "Navigate", "Edit", "Navigate", "Edit"]
  }, {
    title: "Help",
    list: ["Categories", "Edit", "View", "Navigate", "Edit", "View", "Navigate", "Edit", "View", "Navigate"]
  }, {
    title: "File",
    list: ["Navigate", "Categories", "Edit", "View", "View"]
  }, {
    title: "Categories",
    list: ["Categories", "Edit", "View", "Navigate"]
  }, {
    title: "Edit",
    list: ["Categories", "Navigate", "Edit", "View"]
  }, {
    title: "Navigate",
    list: ["Categories", "View", "Navigate", "Edit"]
  }, {
    title: "Help",
    list: ["Categories", "Edit", "View", "Navigate"]
  }]

  // TODO fix the key to be an id

  return (
    <div className="navbar-wrapper">
      <ul className="navbar-list">
        {
          data.map((item, index) =>
            <NavbarElement list={item.list} title={item.title} key={index.toString() + item.title}/>
          )
        }
      </ul>
    </div>
  );
}

export default Navbar;
