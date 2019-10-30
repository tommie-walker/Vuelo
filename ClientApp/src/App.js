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
import Login from "./Helicopter/login";
import SignUp from "./Helicopter/signUp";

function App() {
  const [helicopters, setHelicopters] = useState([]);

  useEffect(() => {
    if (isEmpty(helicopters)) {
      fetch(`${Config.helicopterServiceUrl}`)
        .then(res => {
          if (!res.ok) {
            throw Error(res.statusText);
          }
          console.log(res);
          return res.json();
        })
        .then(h => {
          setHelicopters(h);
        })
        .catch(err => {
          handleError(err);
        });
    }
  }, [])

  const [users] = useState([
    {
      username: "Brayden",
      password: "test",
      email: "test"
    }
  ]);

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
        <Route
          path="/addHeli"
          exact
          render={() => <AddHeli />}
        />
        <Route
          path={`/heliDetailPage/:id`}
          exact
          render={() => <HeliDetailPage />}
        />
        <Route
          path="/login"
          exact
          render={() => <Login users={users} />}
        />
        <Route path="/signUp" exact render={() => <SignUp />} />
      </Layout>
    </Router>
  );
}

export default App;
