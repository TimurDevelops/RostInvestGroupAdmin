import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {FaUsers} from "react-icons/fa";

import PageWrapper from "../../pageComponents/PageWrapper";
import api from "../../../utils/api";

import "./Users.scss"
import Table from "../../ui/Table";


const Users = ({logout}) => {
  const [users, setUsers] = useState([]);
  const [columns] = useState([{
    id: "select-users",
    type: "select",
    flex: "0 0 6.25%"
  }, {
    id: "username",
    type: "link",
    link: "user-view/",
    label: "Логин",
    flex: "0 0 12.5%"
  }, {
    id: "name",
    label: "Имя пользователя",
    flex: "0 0 18.75%"
  }, {
    id: "email",
    label: "Почта",
    flex: "0 0 12.5%"
  }, {
    id: "is_admin",
    label: "Админ",
    type: "checkbox",
    flex: "0 0 6.25%"
  }, {
    id: "create_date",
    type: "date",
    label: "Дата создания",
    flex: "0 0 18.75%"
  }, {
    id: "update_date",
    type: "date",
    label: "Дата последнего изменения",
    flex: "0 0 18.75%"
  }, {
    id: "delete-user",
    empty: true,
    type: "delete",
    flex: "0 0 6.25%"
  }]);

  useEffect(() => {
    const getUsers = async () => {
      const res = await api.post('/users/get-users');
      setUsers(res.data["users"]);
    }
    getUsers().catch((err) => console.error(err))
  }, []);

  return (
    <PageWrapper logout={() => logout()}>
      <div className="section-bg">
        <section className="section-wrapper users-wrapper">
          <div className="section-header">
            <h4 className="section-header-title">
              <span className="section-header-icon"><FaUsers/></span>
              <span className="section-header-text">Пользователи</span>
            </h4>
          </div>
          <Table data={users} columns={columns}/>
        </section>
      </div>
    </PageWrapper>);
}

Users.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default Users;

