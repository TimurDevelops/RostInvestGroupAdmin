import React, {useState} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

import {FaChevronDown} from "react-icons/fa";

import "./NavbarElement.scss"


const countElements = (start, item) => {
  if (typeof item === "object") {
    return start + item.list.reduce(countElements, 1)

  } else if (typeof item === "string") {
    return start + 1
  }
}

const NavbarElement = ({link, title, list}) => {
  const [active, setActive] = useState(false)
  const numberOfElements = list.reduce(countElements, 0)

  const isParent = !!list.length

  return (
    <li className={`navbar-element ${active ? "active" : ""}`}>

      <div className="navbar-drop-down-title" onClick={() => setActive(!active)}>
        <Link to={link}>
          <div className="navbar-drop-down-title-text">{title}</div>
        </Link>
        {isParent && <div className={`navbar-drop-down-title-icon ${active ? "active" : ""}`}><FaChevronDown/></div>}
      </div>
      {
        isParent &&
        <ul className="inner-navbar-list" style={{
          "maxHeight": active ? `${numberOfElements * 35}px` : "0",
          "transition": `all ${numberOfElements * 20}ms ease-in-out`,
        }}>
          {
            list.map((item, index) => {
              if (typeof item === "string" || !item.list.length) {
                return <Link to={item.link}>
                  <li className="inner-navbar-element" key={index.toString() + item.title}>{item}</li>
                </Link>
              } else if (typeof item === "object") {
                return <NavbarElement key={item.id} id={item.id} link={item.link} title={item.title} list={item.list}/>
              }
              return "";
            })
          }
        </ul>
      }

    </li>
  );
}

NavbarElement.propTypes = {
  id: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  list: PropTypes.any.isRequired,
};

export default NavbarElement;
