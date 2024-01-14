import React, {useState} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';

import useUser from "./utils/useUser";

// import PrivateRoute from "./components/ui/PrivateRoute";
import Alert from "./components/ui/Alert";

import Login from "./components/login/Login";
import NotFound from "./components/notFound/NotFound";
import PageWrapper from "./components/usersPage/pageWrapper";

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

  const logout = () => {
    unsetUser();
    setAuth({isAuthenticated: false, isLoading: false});
  };

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
                   element={
                     <PageWrapper setAlert={setAlert} logout={logout}/>
                   }/>

            {/* notFound Page */}
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
