import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Layout } from "antd";


import "antd/dist/antd.css";
import "./App.css";

import Helicopter from "./Helicopter/Helicopter";
import AddHeli from "./Helicopter/addHeli";
import HeliDetailPage from "./Helicopter/heliDetailPage";
import Login from "./User/login";
import SignUp from "./User/signUp";
import ChangePassword from './User/changePassword';
import PrivateRoute from './Components/privateRoute';
import EmailPrompt from './User/emailPrompt';

function App() {
  return (
    <Router>
      <Layout className="layout">
        <Route
          path="/"
          exact
          render={() => <Helicopter />}
        />
        <Route
          path="/addHeli"
          exact
          render={() => <AddHeli />}
        />
        <Route
          path={`/heliDetailPage/:_id`}
          exact
          render={() => <HeliDetailPage />}
        />
        <Route
          path={`/forgotPassword`}
          exact
          render={() => <EmailPrompt />}
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
