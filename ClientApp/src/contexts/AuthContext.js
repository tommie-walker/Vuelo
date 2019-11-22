import React, { createContext, useContext } from 'react';
import config from '../config/app.local.config';
import { useHistory } from "react-router-dom";
import { UserContext } from './UserContext';
import { isEmpty } from 'lodash';
import { message } from 'antd';

export const AuthContext = createContext();

const AuthContextProvider = props => {
  let history = useHistory();
  const { user, updateUser } = useContext(UserContext);
  const username = user.username;
  const jwt = user.token;

  function authenticateSession() {
    if (isEmpty(jwt) || isEmpty(username)) return
    const userAuth = { jwt, username }
    fetch(`${config.authServiceUrl}GetSession`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json'
      },
      accepts: 'application/json',
      body: JSON.stringify(userAuth)
    })
      .then(res => {
        if (!res.ok) throw new Error(res.status);
        console.log('Valid Session ID');
      })
      .catch(err => {
        message.error('Invalid Session');
        updateUser({});
        history.push('/login');
      });
  }

  const authenticate = () => {
    setTimeout(() => authenticateSession(), 600000);
  }

  return (
    <AuthContext.Provider value={{ authenticate }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;