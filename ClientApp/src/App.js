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
import PrivateRoute from './Middleware/privateRoute';
import EmailPrompt from './User/emailPrompt';
import UserProfile from './User/userProfile';
import UserContextProvider from "./contexts/UserContext";
import HelicopterContextProvider from "./contexts/HelicopterContext";
import AuthContextProvider from "./contexts/AuthContext";

function App() {

  return (
    <Router>
      <UserContextProvider>
        <AuthContextProvider >
          <HelicopterContextProvider >
            <Layout className="layout">
              <Route path='/users/:username' exact render={() => <UserProfile />} />
              <Route path="/" exact render={() => <Helicopter />} />
              <PrivateRoute path="/addHeli" exact component={AddHeli} />
              <Route path={`/heliDetailPage/:_id`} exact render={() => <HeliDetailPage />} />
              <Route path={`/forgotPassword`} exact render={() => <EmailPrompt />} />
              <Route path='/resetPassword' exact render={() => <ChangePassword />} />
              <Route path="/login" exact render={() => <Login />} />
              <Route path="/signUp" exact render={() => <SignUp />} />
            </Layout>
          </HelicopterContextProvider>
        </AuthContextProvider>
      </UserContextProvider>
    </Router>
  );
}

export default App;
