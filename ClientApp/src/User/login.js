import React, { useState, useContext } from "react";
import { Form, Input, Card, Avatar, Button, message, Divider } from "antd";
import { Link, useHistory } from "react-router-dom";
import Config from "../config/app.local.config";
import { UserContext } from "../contexts/UserContext";
import Banner from "../NavHeader/banner";

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let history = useHistory();

  const { updateUser } = useContext(UserContext);

  function authenticateUser() {
    const user = { username, password };
    fetch(`${Config.authServiceUrl}Authenticate`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json'
      },
      accepts: 'application/json',
      body: JSON.stringify(user)
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then(userData => {
        updateUser({ username: userData.username, role: userData.role, favorites: userData.favorites, token: userData.token, session: userData.session });
        history.push('/');
      })
      .catch(err => {
        if (username && password) {
          updateUser({});
          message.error("Invalid Credentials");
          setPassword('');
        }
      });
  }

  return (
    <>
      <div className='mainContent'>
        <Banner />
        <Card className="loginCard">
          <Avatar size={120} className="loginIcon" icon="user" />
          <h1 className="big-title">Welcome Back!</h1>
          <Form
            onSubmit={e => {
              e.preventDefault();
            }}
          >
            <Form.Item>
              <Input
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                required={true}
                onChange={e => setUsername(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                required={true}
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" onClick={authenticateUser} className="loginButton" >
              Log In
            </Button>
            <div>
              <Link to="/forgotPassword">
                Forgot password?
              </Link>
              <Divider type="vertical" />
              <Link to="/signUp">
                Sign up
              </Link>
            </div>
          </Form>
        </Card>
      </div>
    </>
  );
}

export default Login;

