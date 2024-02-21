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
import Dialog from "../../ui/Dialogs";
import Button from "@mui/material/Button";


const Users = ({logout, setAlerts}) => {
  const [users, setUsers] = useState([]);
  const [columns] = useState([
    {
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
    }
  ]);
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [usersForDeletion, setUsersForDeletion] = useState([]);

  const selectUser = (userId) => {
    setUsers(users.map((item) => {
      if (item.id === userId) {
        return {...item, checked: !item.checked}
      }
      return item
    }));
  }

  const selectAllUsers = (value) => {
    setUsers(users.map((item) => {
      return {...item, checked: value}
    }));
  }

  const confirmDeleteUser = (userId) => {
    const user = users.find(i => i.id === userId)
    setUsersForDeletion([{id: userId, username: user.username}])
    setDeleteConfirmDialogOpen(true);
  }
  const confirmDeleteUsers = () => {
    const checkedUsers = users.filter(user => user.checked)
    setUsersForDeletion(checkedUsers.map(user => ({id: user.id, username: user.username})))
    setDeleteConfirmDialogOpen(true);
  }

  const handleDelete = async () => {
    try {
      const res = await deleteUsers({users: usersForDeletion})
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

  const deleteUsers = async (data) => {
    try {
      // TODO check if 401 error is working properly
      const res = await api.delete("/users", data);
      return res.data;
    } catch (e) {
      console.error(e)
      return {success: false, errors: e.response.data.errors};
    }
  }


  useEffect(() => {
    const getUsers = async () => {
      // TODO check if 401 error is working properly
      const res = await api.post("/users/get-users");
      setUsers(res.data["users"].map((item) => {
        return {...item, checked: false}
      }));
    }
    getUsers().catch((err) => console.error(err))
  }, []);

  return (
    <PageWrapper logout={() => logout()}>
      <Dialog
        open={deleteConfirmDialogOpen}
        title={"Подтвердите удаление пользователей"}
        message={`Количество удаляемых пользователей: ${usersForDeletion.length}`}
        actions={[
          <Button key={"cancel-delete-btn"} onClick={() => setDeleteConfirmDialogOpen(false)}>Отменить</Button>,
          <Button key={"confirm-delete-btn"} onClick={() => handleDelete()}>Подтвердить</Button>
        ]}
        handleClose={() => setDeleteConfirmDialogOpen(false)}
      />

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
            <div className={"create-user-button"}>
              <span className="table-controls-icon"><IoMdCreate/></span>
              <span className="table-controls-text" onClick={() => {
                confirmDeleteUsers()
              }}>Удалить выбранные</span>
            </div>
          </div>

          <Table data={users} columns={columns}
                 deleteItem={confirmDeleteUser}
                 selectItem={selectUser}
                 selectAll={selectAllUsers}/>
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

