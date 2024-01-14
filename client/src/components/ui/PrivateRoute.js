import React, {Fragment} from 'react';
import {Navigate} from 'react-router-dom';
import PropTypes from 'prop-types';

import Spinner from "./Spinner";

const PrivateRoute = ({component, auth: {isAuthenticated, isLoading}}) => {
  return (
    <Fragment>
      {
        isLoading ? (
          <Spinner/>
        ) : isAuthenticated ?
          component : (
            <Navigate to="/login"/>
          )
      }
    </Fragment>
  );
}

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

export default PrivateRoute;
