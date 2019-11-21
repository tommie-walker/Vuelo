import React, { createContext, useContext } from 'react';
import config from '../config/app.local.config';
import { useHistory } from "react-router-dom";
import { UserContext } from './UserContext';
import { isEmpty } from 'lodash';
import { message } from 'antd';

export const TimerContext = createContext();

const TimerContextProvider = props => {
  let history = useHistory();
  const { user, updateUser } = useContext(UserContext);
  const username = user.username;
  const jwt = user.token;
  const sessionCookie = document.cookie;
  const session = sessionCookie.split("=")[1];

  function authenticateSession() {
    // if (isEmpty(jwt) || isEmpty(session) || isEmpty(username)) return
    // const userAuth = { session, jwt, username }
    // fetch(`${config.userServiceUrl}GetSession`, {
    //   method: "POST",
    //   headers: {
    //     'Content-Type': 'application/json;charset=UTF-8',
    //     'Accept': 'application/json'
    //   },
    //   accepts: 'application/json',
    //   body: JSON.stringify(userAuth)
    // })
    //   .then(res => {
    //     console.log(res.ok);
    //     if (!res.ok) throw new Error(res.status);
    //     console.log('Valid Session ID')
    //   })
    //   .catch(err => {
    //     message.error('invalid session');
    //     // updateUser({});
    //     // history.push('/login');
    //   });
  }

  const startSessionTimer = () => {
    setInterval(() => { authenticateSession(); }, 15000);
  }

  return (
    <TimerContext.Provider value={{ startSessionTimer }}>
      {props.children}
    </TimerContext.Provider>
  );
}

export default TimerContextProvider;