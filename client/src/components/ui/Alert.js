import React from 'react';
import PropTypes from 'prop-types';
import './Alert.scss';

const Alert = ({alerts}) => {
  return (
    <div className={'alerts-holder'}>
      {
        alerts.map(
          (alert) => (
            <div key={alert.id} className={`alert alert-${alert.type}`}>
              {alert.msg}
            </div>
          )
        )
      }
    </div>
  )
}

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

export default Alert;