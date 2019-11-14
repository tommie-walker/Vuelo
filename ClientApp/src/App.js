import React, { useState } from "react";
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
import PrivateRoute from './Middleware/privateRoute';
import EmailPrompt from './User/emailPrompt';
import UserProfile from './User/userProfile';

function App() {

  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const [user, setUser] = useState({ username, token, role });

  return (
    <Router>
      <Layout className="layout">
        <Route
          path="/"
          exact
          render={() => <Helicopter user={user} />}
        />
        <PrivateRoute
          path="/addHeli"
          exact
          component={AddHeli}
        />
        <Route
          path={`/heliDetailPage/:_id`}
          exact
          render={() => <HeliDetailPage user={user} />}
        />
        <Route
          path={`/forgotPassword`}
          exact
          render={() => <EmailPrompt user={user} />}
        />
        <Route
          path='/resetPassword'
          exact
          render={() => <ChangePassword user={user} />}
        />
        <Route
          path='/users/:username'
          exact
          render={() => <UserProfile user={user} />}
        />
        <Route
          path="/login"
          exact
          render={() => <Login user={user} />}
        />
        <Route path="/signUp" exact render={() => <SignUp user={user} />} />
      </Layout>
    </Router>
  );
}

export default App;
