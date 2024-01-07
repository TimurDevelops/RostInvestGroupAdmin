import React from 'react';
import {Route, Navigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from "./Spinner";

const PrivateRoute = ({component: Component, auth: {isAuthenticated, loading}, ...rest}) => {

  return (
    <Route
      {...rest}
      render={props =>
        loading ? (
          <Spinner/>
        ) : isAuthenticated ? (
          <Component {...props} {...rest} />
        ) : (
          <Navigate to="/login"/>
        )
      }
    />
  );
}

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

export default PrivateRoute;
