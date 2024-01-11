import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import api from "../../utils/api";

import "./Login.scss"
import AlertTypes from "../ui/AlertTypes";
import Background from "../ui/Background";

const loginUser = async ({credentials}) => {
  try {
    const res = await api.post("/auth", credentials);
    return res.data;
  } catch (e) {
    throw e.response.data.errors;
  }
}

const Login = ({setUser, setAuth, setAlert}) => {

  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const outputErrors = (errors) => {
    try {
      errors.forEach(error => {
        setAlert(error, AlertTypes.DANGER)
      })
    } catch (err) {
      setAlert("Произошла непредвиденная ошибка!", AlertTypes.DANGER)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setAuth({isLoading: true, isAuthenticated: false});
    try {
      const user = await loginUser({
        credentials: {
          username,
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
      <Background>
        <div className="login-form-holder">
          <form className="login-form" onSubmit={e => handleSubmit(e)}>

            <div className="login-header">
              <p>Добро пожаловать в </p>
              <p className="rost-invest-group">РостИнвестГруп</p>
              <p>Панель управления </p>
            </div>

            <div className="inputs-wrapper">
              <div className="form-group field">
                <input autoComplete="off" type="input" className="form-field" placeholder="Логин" name="username"
                       id="username"
                       onChange={e => setUsername(e.target.value)} required/>
                <label htmlFor="username" className="form-label">Логин</label>
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
      </Background>
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
