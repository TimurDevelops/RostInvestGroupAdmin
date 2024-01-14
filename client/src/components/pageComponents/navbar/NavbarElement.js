import React, {useState} from "react";
import PropTypes, {string} from "prop-types";
import {FaChevronDown} from "react-icons/fa";


import "./NavbarElement.scss"

const countElements = (start, item) => {
  if (typeof item === "object") {
    return start + item.list.reduce(countElements, 1)

  } else if (typeof item === "string") {
    return start + 1
  }
}

const NavbarElement = ({title, list}) => {
  const [active, setActive] = useState(false)
  const numberOfElements = list.reduce(countElements, 0)

  return (
    <li className={`navbar-element ${active ? "active" : ""}`}>

      <div className="navbar-drop-down-title" onClick={() => setActive(!active)}>
        <div className="navbar-drop-down-title-text">{title}</div>
        <div className={`navbar-drop-down-title-icon ${active ? "active" : ""}`}><FaChevronDown/></div>
      </div>

      <ul className="inner-navbar-list" style={{
        "maxHeight": active ? `${numberOfElements * 35}px` : "0",
        "transition": `all ${numberOfElements * 20}ms ease-in-out`,
      }}>
        {
          // TODO fix the key to be an id
          list.map((item, index) => {
            if (typeof item === "object") {
              return <NavbarElement list={item.list} title={item.title} key={index.toString() + item.title}/>

            } else if (typeof item === "string") {
              return <li className="inner-navbar-element" key={index.toString() + item.title}>{item}</li>
            }
          })
        }
      </ul>
    </li>
  );
}

NavbarElement.propTypes = {
  title: PropTypes.string.isRequired,
  list: PropTypes.any.isRequired,
};

export default NavbarElement;
