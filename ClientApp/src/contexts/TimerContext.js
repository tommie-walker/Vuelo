
import React, { createContext, useContext } from 'react';
import config from '../config/app.local.config';
import { useHistory } from "react-router-dom";
import { UserContext } from './UserContext';

export const TimerContext = createContext();

const TimerContextProvider = props => {
  let history = useHistory();
  const { user, updateUser } = useContext(UserContext);
  const jwt = user.token;
  const session = user.session;

  function authenticateSession() {
    const userAuth = { session, jwt }
    fetch(`${config.userServiceUrl}GetSession`, {
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
        console.log('Valid Session ID')
      })
      .catch(err => {
        updateUser({});
        history.push('/login');
      });
  }

  const startSessionTimer = () => {
    setInterval(() => authenticateSession, 10000);
  }

  return (
    <TimerContext.Provider value={{ startSessionTimer }}>
      {props.children}
    </TimerContext.Provider>
  );
}

export default TimerContextProvider;