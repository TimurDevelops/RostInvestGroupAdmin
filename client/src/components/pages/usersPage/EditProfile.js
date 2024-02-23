import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import {FaUsers} from "react-icons/fa";
import {IoMdCreate} from "react-icons/io";
import {FaGear} from "react-icons/fa6";

import PageWrapper from "../../pageComponents/PageWrapper";

import AlertTypes from "../../ui/AlertTypes";
import api from "../../../utils/api";

import "./EditProfile.scss"


const EditProfile = ({logout, setAlerts, currentUser}) => {
  const navigate = useNavigate()

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const editUser = async (data) => {
    try {
      // TODO check if 401 error is working properly
      const res = await api.post("/users/edit-user", data);
      return res.data;
    } catch (e) {
      console.error(e)
      return {success: false, errors: e.response.data.errors}
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await editUser({
        id: currentUser.id,
        username,
        name,
        email,
        isAdmin
      });
      if (res.success === true) {
        setAlerts([{msg: "Данные успешно отредактированны", type: AlertTypes.SUCCESS}])
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
      // TODO check if 401 error is working properly
      const res = await api.post("/users/get-user", {userId: currentUser.id});
      const user = res.data["user"]
      setUsername(user["username"])
      setEmail(user["email"])
      setName(user["name"])
      setIsAdmin(user["is_admin"])
    }
    getUsers().catch((err) => console.error(err))
  }, []);

  return (
    <PageWrapper logout={() => logout()}>
      <div className="section-bg">
        <section className="section-wrapper user-form-section-wrapper">
          <div className="section-header">
            <h4 className="section-header-title">
              <span className="section-header-icon"><FaUsers/></span>
              <span className="section-header-text">Отредактировать данные</span>
            </h4>
          </div>

          <form className="login-form" onSubmit={e => handleSubmit(e)}>
            <div className="inputs-wrapper">
              <div className="form-group field">
                <input type="input" className="form-field" placeholder="Логин" name="username" id="username"
                       value={username}
                       onChange={e => setUsername(e.target.value)} required/>
                <label htmlFor="username" className="form-label">Логин*</label>
              </div>

              <div className="form-group field">
                <input type="email" className="form-field" placeholder="Почта" name="email" id="email"
                       value={email}
                       onChange={e => setEmail(e.target.value)}/>
                <label htmlFor="email" className="form-label">Почта</label>
              </div>

              <div className="form-group field">
                <input type="text" className="form-field" placeholder="Имя пользователя" name="name" id="name"
                       value={name}
                       onChange={e => setName(e.target.value)}/>
                <label htmlFor="name" className="form-label">Имя пользователя</label>
              </div>

              <div className="form-group field flex">
                <label htmlFor="name" className="form-label">Администратор:</label>
                <input type="checkbox" className="form-field-checkbox" placeholder="Админ" name="isAdmin"
                       id="isAdmin"
                       checked={isAdmin}
                       onChange={e => {
                         setIsAdmin(e.target.checked)
                       }}/>
              </div>
            </div>

            <div className="submit-btn-wrapper ">
              <button type="submit" className="submit-btn">
                <span><IoMdCreate/>Изменить</span>
              </button>
            </div>
          </form>

          <div className="submit-btn-wrapper ">
            <Link to={"/change-password"} className="submit-btn">
              <span><FaGear/>Сменить пароль</span>
            </Link>
          </div>

          <div className="back-btn-wrapper">
            <div onClick={() => navigate(-1)}>
              <div className="back-btn">
                <span className="arrows">
                  <span className="top-arrow-line"/>
                  <span className="center-arrow-line"/>
                  <span className="bottom-arrow-line"/>
                </span>
                <span className="back-text">
                  Вернуться
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

EditProfile.propTypes = {
  currentUser: PropTypes.object,
  logout: PropTypes.func.isRequired,
  setAlerts: PropTypes.func.isRequired
};

export default EditProfile;

