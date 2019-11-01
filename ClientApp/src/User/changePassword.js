import React, { useState, useEffect } from 'react';
import { Form, Input, notification, Button, Card, Avatar } from 'antd';
import Config from '../config/app.local.config';

import Banner from '../NavHeader/banner';

function ChangePassword() {
  const [password1, setPassword1] = useState();
  const [password2, setPassword2] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    fetch(`${Config.userServiceUrl}userForgotPassword`, {
      method: 'GET'
    })
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then(user => {
        setUser(user);
      })
      .catch(err => {
        notification.open(err)
      })
  }, []);

  function changeUserPassword() {

    const updatedUser = {
      user: user.name,
      email: user.email,
      password: password1
    }

    if (!password1 === password2) {
      return notification.open('The passwords you entered do not match');
    }

    fetch(`${Config.userServiceUrl}`, {
      method: "PUT",
      headers: "application/JSON",
      body: JSON.stringify(updatedUser)
    })
      .then(() => {
        console.log("success")
      })
      .catch(err => {
        notification.open('err')
      })
  }

  return (
    <div className='mainContent smallContent'>
      <Banner />
      <Card className="loginCard">
        <Avatar size={120} className="loginIcon" icon="user" />
        <h1 className="big-title">Change Password</h1>
        <Form
          onSubmit={e => {
            e.preventDefault();
          }}>
          <Form.Item>
            <Input
              type="text"
              placeholder="Enter your new Password"
              name="password1"
              value={password1}
              onChange={setPassword1}
            />
          </Form.Item>
          <Form.Item>
            <Input
              type="text"
              placeholder="Verify your new password"
              name="password2"
              value={password2}
              onChange={setPassword2}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            onClick={changeUserPassword}
            className="loginButton"
          >
            Update Password
          </Button>
        </Form>
      </Card>
    </div>
  )
}

export default ChangePassword;