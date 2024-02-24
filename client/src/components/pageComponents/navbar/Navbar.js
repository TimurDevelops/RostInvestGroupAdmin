import React, {useEffect, useState} from "react";

import NavbarElement from "./NavbarElement";

import "./Navbar.scss"
import api from "../../../utils/api";


const Navbar = () => {
  const [navbarData, setNavbarData] = useState([])

  useEffect(() => {
    const getCategories = async () => {
      const res = await api.post("/categories/get-tree");
      setNavbarData([
        {list: [], title: "Не откатегаризованные продукты", id: "products"},
        {list: [], title: "Не откатегаризованные категории", id: "categories"},
        {list: [], title: "Пользователи", id: "users"},
        ...res.data["categories"]])
    }
    getCategories().catch((err) => console.error(err))
  }, []);


  return (
    <div className="navbar-wrapper">
      <ul className="navbar-list">
        {
          navbarData.map((item, index) =>
            <NavbarElement list={item.list} title={item.title} key={item.id}/>
          )
        }
      </ul>
    </div>
  );
}

export default Navbar;
