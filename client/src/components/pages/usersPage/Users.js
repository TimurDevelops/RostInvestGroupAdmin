import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {FaUsers} from "react-icons/fa";
import {IoMdCreate} from "react-icons/io";

import Table from "../../ui/Table";
import PageWrapper from "../../pageComponents/PageWrapper";

import api from "../../../utils/api";

import "./Users.scss"
import AlertTypes from "../../ui/AlertTypes";


const Users = ({logout, setAlerts}) => {
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

  const deleteUsers = async (data) => {
    try {
      const res = await api.delete("/auth", data);
      return res.data;
    } catch (e) {
      console.error(e)
      return {success: false, errors: e.response.data.errors};
    }
  }

  const handleDelete = async (userId) => {
    try {
      const user = users.find(i => i.id === userId)
      const res = await deleteUsers({users: [{userId, username: user.username}]})
      if (res.success === true) {
        setAlerts([{msg: "Пользователь удален.", type: AlertTypes.SUCCESS}])
      } else {
        setAlerts(res.errors.map(error => ({msg: error, type: AlertTypes.DANGER})))
      }
    } catch (errors) {
      console.error(errors)
      setAlerts([{msg: "Произошла непредвиденная ошибка!", type: AlertTypes.DANGER}])
    }
  }

  useEffect(() => {
    const getUsers = async () => {
      const res = await api.post("/users/get-users");
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

          <div className="table-controls">
            <div className="create-user-button">
              <span className="table-controls-icon"><IoMdCreate/></span>
              <span className="table-controls-text"><Link to={"create-user"}>Создать</Link></span>
            </div>
            <div className={`create-user-button`}>
              <span className="table-controls-icon"><IoMdCreate/></span>
              <span className="table-controls-text">Удалить выбранные</span>
            </div>
          </div>

          <Table data={users} columns={columns} deleteItem={handleDelete}/>
        </section>
      </div>
    </PageWrapper>
  );
}

Users.propTypes = {
  logout: PropTypes.func.isRequired,
  setAlerts: PropTypes.func.isRequired,
};

export default Users;

