import React, { useState } from "react";
import { Form, Input, Button, Card, Avatar, message } from "antd";
import Config from "../config/app.local.config";
import Banner from "../NavHeader/banner";

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
    fetch(`${Config.authServiceUrl}CreateUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=UTF-8" },
      accepts: "application/json",
      body: JSON.stringify(newUser)
    })
      .then(res => {
        // console.log(parseInt(res.body, 64));
        switch (Number(res.body)) {
          case 2: {
            message.error('Invalid Email')
            if (!res.ok) throw new Error(res.status)
            break;
          }
          case 5: message.error('That username is already in use'); break;
          case 6: {
            message.error('Email Exists');
            break;
          }
          default: message.success('yay')
        }
        if (!res.ok) throw new Error(res.status);
        return res.json()
      })
      .then(errorCode => {
        message.success(`User Created: ${newUser.username}`);
        clearFields();
      })
      .catch(err => {
        console.log(err);
        message.error('That email or username is already in use.');
        setPassword('');
        setUsername('');
      });
  }

  return (
    <>
      <div className='mainContent'>
        <Banner />
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
