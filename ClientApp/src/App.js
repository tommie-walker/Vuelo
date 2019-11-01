import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Layout, notification } from "antd";
import Config from "./config/app.local.config";
import { isEmpty } from 'lodash';

import "antd/dist/antd.css";
import "./App.css";

import Helicopter from "./Helicopter/Helicopter";
import AddHeli from "./Helicopter/addHeli";
import HeliDetailPage from "./Helicopter/heliDetailPage";
import Login from "./User/login";
import SignUp from "./User/signUp";
import ChangePassword from './User/changePassword';
import PrivateRoute from './Components/privateRoute';

function App() {
  const [helicopters, setHelicopters] = useState([]);

  useEffect(() => {
    if (isEmpty(helicopters)) {
      fetch(`${Config.helicopterServiceUrl}`)
        .then(res => {
          if (!res.ok) {
            throw Error(res.statusText);
          }
          return res.json();
        })
        .then(h => {
          setHelicopters(h);
        })
        .catch(err => {
          handleError(err);
        });
    }
  }, [helicopters])

  function handleError() {
    notification.open("Oh No! Something went wrong!");
  }

  return (
    <Router>
      <Layout className="layout">
        <Route
          path="/"
          exact
          render={() => (
            <Helicopter helicopters={helicopters} />
          )}
        />
        <PrivateRoute
          path="/addHeli"
          exact
          render={() => <AddHeli />}
        />
        <PrivateRoute
          path={`/heliDetailPage/:id`}
          exact
          render={() => <HeliDetailPage />}
        />
        <Route
          path='/resetPassword'
          exact
          render={() => <ChangePassword />}
        />
        <Route
          path="/login"
          exact
          render={() => <Login />}
        />
        <Route path="/signUp" exact render={() => <SignUp />} />
      </Layout>
    </Router>
  );
}

export default App;
