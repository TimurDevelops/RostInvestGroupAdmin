import React, {useEffect, useState} from "react";

import NavbarElement from "./NavbarElement";

import api from "../../../utils/api";

import "./Navbar.scss"


const Navbar = () => {
  const [navbarData, setNavbarData] = useState([])

  useEffect(() => {
    const getCategories = async () => {
      const res = await api.post("/categories/get-tree");
      const data = res.data["categories"].map(item => {
        return {...item, link: `/categories/categories-view/:${item.id}`}
      })

      setNavbarData([
        {list: [], title: "Не откатегаризованные продукты", id: "products", link: "/products"},
        {list: [], title: "Не откатегаризованные категории", id: "categories", link: "/categories"},
        {list: [], title: "Пользователи", id: "users", link: "/users"},
        ...data]
      )
    }
    getCategories().catch((err) => console.error(err))
  }, []);


  return (
    <div className="navbar-wrapper">
      <ul className="navbar-list">
        {
          navbarData.map((item) =>
            <NavbarElement key={item.id} id={item.id} link={item.link} title={item.title} list={item.list}/>
          )
        }
      </ul>
    </div>
  );
}

export default Navbar;
