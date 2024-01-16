import React, {useState} from "react";
import PropTypes from "prop-types";
import {FaUsers} from "react-icons/fa";
import {IoMdCreate} from "react-icons/io";

import PageWrapper from "../../pageComponents/PageWrapper";

import {outputErrors} from "../../../utils/utils";
import AlertTypes from "../../ui/AlertTypes";
import api from "../../../utils/api";

import "./Users.scss"


const CreateUser = ({logout, setAlert}) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [isAdmin, setIsAdmin] = useState();

  const createUser = async (credentials) => {
    try {
      const res = await api.post("/users", credentials);
      return res.data;
    } catch (e) {
      outputErrors(e.response.data.errors, setAlert)
      return {success: false}
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setAlert("Введенные пароли не совпадают", AlertTypes.DANGER)
    }
    try {
      console.log("res")
      const res = await createUser({
        credentials: {
          username,
          password,
          name,
          email,
          isAdmin
        }
      });
      if (res.success === true) {
        setAlert("Пользователь создан", AlertTypes.SUCCESS)
      } else {
        setAlert("Не удалось создать пользователя", AlertTypes.PRIMARY)
      }
    } catch (errors) {
      setAlert("Произошла непредвиденная ошибка!", AlertTypes.DANGER)
    }
  }

  return (
    <PageWrapper logout={() => logout()}>
      <div className="section-bg">
        <section className="section-wrapper">
          <div className="section-header">
            <h4 className="section-header-title">
              <span className="section-header-icon"><FaUsers/></span>
              <span className="section-header-text">Создать нового пользователя</span>
            </h4>
          </div>

          <form className="login-form" onSubmit={e => handleSubmit(e)}>
            <div className="inputs-wrapper">
              <div className="form-group field">
                <input type="input" className="form-field" placeholder="Логин" name="username" id="username"
                       onChange={e => setUsername(e.target.value)} required/>
                <label htmlFor="username" className="form-label">Логин*</label>
              </div>

              <div className="form-group field">
                <input type="password" className="form-field" placeholder="Пароль" name="password" id="password"
                       onChange={e => setPassword(e.target.value)} required/>
                <label htmlFor="password" className="form-label">Пароль*</label>
              </div>

              <div className="form-group field">
                <input type="password" className="form-field" placeholder="Подтвердите пароль" name="confirmPassword"
                       id="confirmPassword"
                       onChange={e => setConfirmPassword(e.target.value)} required/>
                <label htmlFor="confirmPassword" className="form-label">Подтвердите пароль*</label>
              </div>

              <div className="form-group field">
                <input type="email" className="form-field" placeholder="Почта" name="email" id="email"
                       onChange={e => setName(e.target.value)}/>
                <label htmlFor="email" className="form-label">Почта</label>
              </div>

              <div className="form-group field">
                <input type="text" className="form-field" placeholder="Имя пользователя" name="name" id="name"
                       onChange={e => setEmail(e.target.value)}/>
                <label htmlFor="name" className="form-label">Имя пользователя</label>
              </div>

              <div className="form-group field flex">
                <label htmlFor="name" className="form-label">Администратор:</label>
                <input type="checkbox" className="form-field-checkbox" placeholder="Имя пользователя" name="isAdmin"
                       id="isAdmin"
                       onChange={e => {
                         setIsAdmin(e.target.checked)
                       }}/>
              </div>
            </div>

            <div className="submit-btn-wrapper">
              <button type="submit" className="submit-btn">
                <span><IoMdCreate/>Создать</span>
              </button>
            </div>

          </form>
        </section>
      </div>
    </PageWrapper>
  );
}

CreateUser.propTypes = {
  logout: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

export default CreateUser;

