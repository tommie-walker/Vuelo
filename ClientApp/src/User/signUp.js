import React, { useState } from "react";
import { Form, Input, Button, Card, Avatar, message } from "antd";
import Config from "../config/app.local.config";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  function clearFields() {
    setUsername('');
    setPassword('');
    setEmail('');
  }

  function handleSubmit() {
    const newUser = { email, username, password };
    fetch(`${Config.userServiceUrl}CreateUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      accepts: "application/json",
      body: JSON.stringify(newUser)
    })
      .then(res => {
        if (!res.ok) throw new Error(res.status), res.json()
        return res.json()
      })
      .then(errorCode => {
        ;
        message.success(`User Created: ${newUser.username}`);
        clearFields();
      })
      .catch(err => {
        message.error('That email or username is already in use.');
        setPassword('');
        setUsername('');
      });
  }

  return (
    <>
      <div className='mainContent'>

        <Card className="loginCard">
          <Avatar size={120} className="loginIcon" icon="user" />
          <h1 className="big-title">Create Account</h1>
          <Form
            onSubmit={e => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <Form.Item>
              <Input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                required={true}
                onChange={e => setEmail(e.target.value)}
              />
            </Form.Item>
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
            <Button type="primary" htmlType="submit" className="loginButton">
              Sign Up
          </Button>
          </Form>
        </Card>
      </div>
    </>
  );
}

export default SignUp;
