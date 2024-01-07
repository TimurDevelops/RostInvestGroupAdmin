import React from 'react';
import {Route, Navigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from "./Spinner";

const PrivateRoute = ({component: Component, auth: {isAuthenticated, loading}, ...rest}) => {
  return (
    <Route
      {...rest}
      element={(
        loading ? (
          <Spinner/>
        ) : isAuthenticated ? (
          <Component {...rest} />
        ) : (
          <Navigate to="/login"/>
        )
      )}
    />
  );
}

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

export default PrivateRoute;
