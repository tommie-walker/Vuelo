import React from 'react';
import { Route, Link } from 'react-router-dom';

export default function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        !(localStorage.getItem('token') || '') ? (
          < Link to='/login' />
        ) : (
            < Component {...props} />
          )
      }
    />
  );
}