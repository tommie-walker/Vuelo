import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

export default function PrivateRoute({ component: Component, ...rest }) {
  const { user } = useContext(UserContext);
  return (
    <Route
      {...rest}
      render={props =>
        !(user.token || '') ? (
          < Redirect to='/login' />
        ) : (
            < Component {...props} />
          )
      }
    />
  );
}