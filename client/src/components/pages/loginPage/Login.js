import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";

import Background from "../../pageComponents/Background";

import AlertTypes from "../../ui/AlertTypes";
import api from "../../../utils/api";

import "./Login.scss"


const Login = ({setUser, setAuth, setAlerts}) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();


  const loginUser = async ({credentials}) => {
    try {
      // TODO check if 401 error is working properly
      const res = await api.post("/auth", credentials);
      const token = res.data.token;
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return res.data;
    } catch (e) {
      console.error(e)
      return {success: false, errors: e.response.data.errors};
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setAuth({isLoading: true, isAuthenticated: false});
    try {
      const res = await loginUser({
        credentials: {
          username,
          password,
        }
      });
      if (res.success === true) {
        setUser({username: res.user, token: res.token, id: res.id})
        setAuth({isLoading: false, isAuthenticated: true});
        navigate("/users");
      } else {
        setAlerts(res.errors.map(error => {
          return {msg: error, type: AlertTypes.DANGER}
        }))
      }
    } catch (errors) {
      console.error(errors)
      setAuth({isLoading: false, isAuthenticated: false});
      setAlerts([{msg: "Произошла непредвиденная ошибка!", type: AlertTypes.DANGER}])
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
  setAlerts: PropTypes.func.isRequired,
  setAuth: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired
}

export default Login;
