import React, {useState} from "react";
import PropTypes from "prop-types";
import {FaUsers} from "react-icons/fa";
import {IoMdCreate} from "react-icons/io";

import PageWrapper from "../../pageComponents/PageWrapper";

import AlertTypes from "../../ui/AlertTypes";
import api from "../../../utils/api";
import {Link} from "react-router-dom";


const ChangePassword = ({logout, setAlerts, currentUser}) => {
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const changePassword = async (data) => {
    try {
      // TODO check if 401 error is working properly
      const res = await api.post("/users/change-password", data);
      return res.data;
    } catch (e) {
      console.error(e)
      return {success: false, errors: e.response.data.errors}
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setAlerts([{msg: "Введенные пароли не совпадают!", type: AlertTypes.DANGER}])
      return
    }
    try {
      const res = await changePassword({
        userId: currentUser.id,
        password,
      });
      if (res.success === true) {
        setAlerts([{msg: "Пароль изменен!", type: AlertTypes.SUCCESS}])
      } else {
        setAlerts(res.errors.map(error => ({msg: error, type: AlertTypes.DANGER})))
      }
    } catch (errors) {
      console.error(errors)
      setAlerts([{msg: "Произошла непредвиденная ошибка!", type: AlertTypes.DANGER}])
    }
  }

  return (
    <PageWrapper logout={() => logout()}>
      <div className="section-bg">
        <section className="section-wrapper user-form-section-wrapper">
          <div className="section-header">
            <h4 className="section-header-title">
              <span className="section-header-icon"><FaUsers/></span>
              <span className="section-header-text">Сменить пароль</span>
            </h4>
          </div>

          <form className="login-form" onSubmit={e => handleSubmit(e)}>
            <div className="inputs-wrapper">

              <div className="form-group field">
                <input type="password" className="form-field" placeholder="Новый пароль" name="password" id="password"
                       onChange={e => setPassword(e.target.value)} required/>
                <label htmlFor="password" className="form-label">Новый пароль*</label>
              </div>

              <div className="form-group field">
                <input type="password" className="form-field" placeholder="Подтвердите новый пароль" name="confirmPassword"
                       id="confirmPassword"
                       onChange={e => setConfirmPassword(e.target.value)} required/>
                <label htmlFor="confirmPassword" className="form-label">Подтвердите новый пароль*</label>
              </div>
            </div>

            <div className="submit-btn-wrapper">
              <button type="submit" className="submit-btn">
                <span><IoMdCreate/>Изменить пароль</span>
              </button>
            </div>
          </form>

          <div className="back-btn-wrapper">
            <Link to={"/edit-profile"}>
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
            </Link>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

ChangePassword.propTypes = {
  currentUser: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  setAlerts: PropTypes.func.isRequired
};

export default ChangePassword;

