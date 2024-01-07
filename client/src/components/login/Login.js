import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import api from "../../utils/api";

import "./Login.scss"
import AlertTypes from "../ui/AlertTypes";

const loginUser = async ({credentials}) => {
  try {
    const res = await api.post("/auth/admin", credentials);
    return res.data;
  } catch (e) {
    throw e.response.data.errors;
  }
}

const Login = ({setUser, setAuth, setAlert}) => {

  const navigate = useNavigate();
  const [login, setLogin] = useState();
  const [password, setPassword] = useState();

  const outputErrors = (errors) => {
    try {
      console.log(errors)
      errors.forEach(err => {
        setAlert(err.msg, AlertTypes.DANGER)
      })
    } catch (err) {
      setAlert("Произошла непредвиденная ошибка!", AlertTypes.DANGER)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setAuth({isLoading: true, isAuthenticated: false});
    try {
      console.log("auth")
      const user = await loginUser({
        credentials: {
          login,
          password,
        }
      });
      setUser(user)
      setAuth({isLoading: false, isAuthenticated: true});
      navigate("/user-view");

    } catch (errors) {
      setAuth({isLoading: false, isAuthenticated: false});
      outputErrors(errors);
    }
  }

  return (
    <div className="login-wrapper">
      <div className="background-holder">

        <div className="login-form-holder">

          <form className="login-form" onSubmit={e => handleSubmit(e)}>

            <div className="login-header">
              <p>Добро пожаловать в </p>
              <p className="rost-invest-group">РостИнвестГруп</p>
              <p>Панель управления </p>
            </div>

            <div className="inputs-wrapper">
              <div className="form-group field">
                <input autoComplete="off" type="input" className="form-field" placeholder="Логин" name="login"
                       id="login"
                       onChange={e => setLogin(e.target.value)} required/>
                <label htmlFor="login" className="form-label">Логин</label>
              </div>

              <div className="form-group field">
                <input type="password" className="form-field" placeholder="Пароль" name="password" id="password"
                       onChange={e => setPassword(e.target.value)} required/>
                <label htmlFor="password" className="form-label">Пароль</label>
              </div>
            </div>

            <div className="submit-btn-wrapper">
              <button type="submit" className="btn" id="loginBtn">
                <span>Войти</span>
              </button>
            </div>

          </form>

        </div>


        <div className="login-bg-colors"/>
      </div>
    </div>
  );
}

Login.propTypes = {
  auth: PropTypes.object.isRequired,
  setAlert: PropTypes.func.isRequired,
  setAuth: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired
}

export default Login;


//
//
