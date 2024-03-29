import React, {useCallback, useEffect, useState} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';

import Login from "./components/pages/loginPage/Login";
import NotFound from "./components/pages/notFoundPage/NotFound";
import Users from "./components/pages/usersPage/Users";
import CreateUser from "./components/pages/usersPage/CreateUser";
import EditProfile from "./components/pages/usersPage/EditProfile";
import UserView from "./components/pages/usersPage/UserVeiw";

import useUser from "./utils/useUser";
import PrivateRoute from "./components/ui/PrivateRoute";
import Alert from "./components/ui/Alert";

import api from "./utils/api";

import './App.css';
import './Common.scss';
import ChangePassword from "./components/pages/usersPage/ChangePassword";
import Products from "./components/pages/productPage/Products";
import ProductView from "./components/pages/productPage/ProductView";
import CreateProduct from "./components/pages/productPage/CreateProduct";
import Categories from "./components/pages/categoriesPage/Categories";
import CategoryView from "./components/pages/categoriesPage/CategoryVeiw";
import CreateCategory from "./components/pages/categoriesPage/CreateCategory";


const App = () => {
  const {user, setUser, unsetUser} = useUser()
  const [auth, setAuth] = useState({isAuthenticated: Boolean(user && user.token), isLoading: false});
  const [alertsState, setAlertsState] = useState([]);
  // TODO useHistory hook

  const setAlerts = (alerts, timeout = 5000) => {
    alerts = alerts.map(({msg, type}) => {
      const id = uuidv4();
      setTimeout(() => removeAlert(id), timeout);
      timeout += 100;
      return {msg, type, id}
    })
    setAlertsState([...alertsState, ...alerts])
  };

  const removeAlert = (id) => {
    setAlertsState(alerts => alerts.filter((alert) => alert.id !== id));
  }

  const logout = useCallback(() => {
    unsetUser();
    setAuth({isAuthenticated: false, isLoading: false});
  }, [unsetUser]);

  if (auth.isAuthenticated) {
    api.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
  }

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
          logout();
        }
        return Promise.reject(err);
      }
    );
  }, [logout]);


  return (
    <div className="app">
      <div className="app-body">
        <Alert alerts={alertsState}/>
        <Router>
          <Routes>
            {/* Sign In Page */}
            <Route path="/login"
                   element={
                     <Login setAuth={setAuth} setAlerts={setAlerts} setUser={setUser} auth={auth}/>
                   }/>
            {/* Edit  */}
            <Route path="/edit-profile"
                   auth={auth}
                   element={
                     <PrivateRoute
                       auth={auth}
                       component={<EditProfile setAlerts={setAlerts} logout={logout} currentUser={user}/>}/>
                   }/>
            {/* Change Password */}
            <Route path="/change-password"
                   auth={auth}
                   element={
                     <PrivateRoute
                       auth={auth}
                       component={<ChangePassword setAlerts={setAlerts} logout={logout} currentUser={user}/>}/>
                   }/>

            {/* Users Page */}
            <Route path="/users"
                   auth={auth}
                   element={
                     <PrivateRoute
                       auth={auth}
                       component={<Users setAlerts={setAlerts} logout={logout}/>}/>
                   }/>
            {/* Create user page */}
            <Route path="/users/create-user"
                   auth={auth}
                   element={
                     <PrivateRoute
                       auth={auth}
                       component={<CreateUser setAlerts={setAlerts} logout={logout}/>}/>
                   }/>
            {/* View user page */}
            <Route path="/users/user-view/:userId"
                   auth={auth}
                   element={
                     <PrivateRoute
                       auth={auth}
                       component={<UserView setAlerts={setAlerts} logout={logout}/>}/>
                   }/>


            {/* Products page */}
            <Route path="/products"
                   auth={auth}
                   element={
                     <PrivateRoute
                       auth={auth}
                       component={<Products setAlerts={setAlerts} logout={logout}/>}/>
                   }/>
            {/* Products view page */}
            <Route path="/products/product-view/:productId"
                   auth={auth}
                   element={
                     <PrivateRoute
                       auth={auth}
                       component={<ProductView setAlerts={setAlerts} logout={logout}/>}/>
                   }/>
            {/* Create product page */}
            <Route path="/products/create-product"
                   auth={auth}
                   element={
                     <PrivateRoute
                       auth={auth}
                       component={<CreateProduct setAlerts={setAlerts} logout={logout}/>}/>
                   }/>


            {/* Categories page */}
            <Route path="/categories"
                   auth={auth}
                   element={
                     <PrivateRoute
                       auth={auth}
                       component={<Categories setAlerts={setAlerts} logout={logout}/>}/>
                   }/>
            {/* Category view page */}
            <Route path="/categories/categories-view/:categoryId"
                   auth={auth}
                   element={
                     <PrivateRoute
                       auth={auth}
                       component={<CategoryView setAlerts={setAlerts} logout={logout}/>}/>
                   }/>
            {/* Create category page */}
            <Route path="/categories/create-category"
                   auth={auth}
                   element={
                     <PrivateRoute
                       auth={auth}
                       component={<CreateCategory setAlerts={setAlerts} logout={logout}/>}/>
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
