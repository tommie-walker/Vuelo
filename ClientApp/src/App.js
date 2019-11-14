import React, { useState, useContext } from "react";
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
import Banner from "./NavHeader/banner";
import UserContextProvider from "./contexts/UserContext";

const App = () => {
  const { Header, Content } = Layout;

  return (

    <Router>
      <Layout>
        <Header>
          <Route
            path="/"
            render={() => <UserContextProvider><Banner /></UserContextProvider>}
          />
        </Header>
        <Layout className="layout">
          <Route
            path="/"
            exact
            render={() => <Helicopter />}
          />
          <PrivateRoute
            path="/addHeli"
            exact
            component={AddHeli}
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
            path='/users/:username'
            exact
            render={() => <UserProfile />}
          />
          <Route
            path="/login"
            exact
            render={() => <Login />}
          />
          <Route path="/signUp" exact render={() => <SignUp />} />
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
