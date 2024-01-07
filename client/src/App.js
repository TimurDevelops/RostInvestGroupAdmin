import React, {useState} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';

import useUser from "./utils/useUser";

// import PrivateRoute from "./components/ui/PrivateRoute";

import Login from "./components/login/Login";

import {v4 as uuidv4} from 'uuid';

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

  return (
    <div className="app">
      <div className="app-body">

        <Router>
          <Routes>
            {/* Sign In Page */}
            <Route path="/login"
                   element={
                     <Login setAuth={setAuth} setAlert={setAlert} setUser={setUser} auth={auth}/>
                   }/>

            {/* 404 Page */}
            <Route path="*" element={(
              auth.isAuthenticated ? <Navigate to="/not-found"/> : <Navigate to="/login"/>
            )}/>

          </Routes>
        </Router>


      </div>
    </div>
  );
};

export default App;
