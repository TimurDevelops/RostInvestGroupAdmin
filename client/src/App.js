import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';

import Login from "./components/pages/loginPage/Login";
import NotFound from "./components/pages/notFoundPage/NotFound";
import Users from "./components/pages/usersPage/Users";
import CreateUser from "./components/pages/usersPage/CreateUser";

import useUser from "./utils/useUser";
import PrivateRoute from "./components/ui/PrivateRoute";
import Alert from "./components/ui/Alert";

import api from "./utils/api";

import './App.css';
import './Common.scss';

const App = () => {
  const {user, setUser, unsetUser} = useUser()
  const [auth, setAuth] = useState({isAuthenticated: Boolean(user && user.token), isLoading: false});
  const [alerts, setAlerts] = useState([]);

  const setAlert = (msg, alertType, timeout = 5000) => {
    const id = uuidv4();
    setAlerts([...alerts, {msg, alertType, id}])

    setTimeout(() => removeAlert(id), timeout);
  };

  const removeAlert = (id) => {
    setAlerts(alerts => alerts.filter((alert) => alert.id !== id));
  }

  const logout = () => {
    unsetUser();
    setAuth({isAuthenticated: false, isLoading: false});
  };

  useEffect(() => {
    /**
     intercept any error responses from the api
     and check if the token is no longer valid.
     ie. Token has expired or user is no longer
     authenticated.
     logout the user if the token has expired
     **/
    api.interceptors.response.use(
      res => res,
      err => {
        if (Number(err.response.status) === 401) {
          // logout();
          console.log("logout")
        }
        return Promise.reject(err);
      }
    );
  }, []);


  return (
    <div className="app">
      <div className="app-body">
        <Alert alerts={alerts}/>
        <Router>
          <Routes>
            {/* Sign In Page */}
            <Route path="/login"
                   element={
                     <Login setAuth={setAuth} setAlert={setAlert} setUser={setUser} auth={auth}/>
                   }/>

            {/* Users Page */}
            <Route path="/users"
                   auth={auth}
                   element={
                     <PrivateRoute
                       auth={auth}
                       component={<Users setAlert={setAlert} logout={logout}/>}/>
                   }/>
            {/* Create user page */}
            <Route path="/users/create-user"
                   auth={auth}
                   element={
                     <PrivateRoute
                       auth={auth}
                       component={<CreateUser setAlert={setAlert} logout={logout}/>}/>
                   }/>

            {/* notFoundPage Page */}
            <Route path="/not-found"
                   element={<NotFound/>}/>

            {/* Navigation */}

            <Route path="*"
                   element={(
                     auth.isAuthenticated ? <Navigate to="/not-found"/> : <Navigate to="/login"/>
                   )}/>

          </Routes>
        </Router>

      </div>
    </div>
  );
};

export default App;
