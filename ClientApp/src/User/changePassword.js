import React, { useState } from 'react';
import { Form, Input, Button, Card, Avatar, message } from 'antd';
import Config from '../config/app.local.config';
import Banner from '../NavHeader/banner';

function ChangePassword(props) {
  const [code, setCode] = useState();
  const [password, setPassword] = useState();
  const [passwordCheck, setPasswordCheck] = useState();

  function changeUserPassword() {
    if (!password === passwordCheck) {
      return message.error('The passwords you entered do not match');
    }

    const userInfo = { code, password }

    fetch(`${Config.authServiceUrl}UpdatePassword`, {
      method: "PUT",
      headers: { "Content-Type": "application/JSON" },
      body: JSON.stringify(userInfo)
    })
      .then(res => {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      })
      .then(() => {
        message.success("Your password has been changed.");
      })
      .catch(err => {
        console.log(err);
        message.error("Bad");
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
              placeholder="Enter the code from your email."
              name="code"
              value={code}
              onChange={e => setCode(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input
              type="password"
              placeholder="Enter your new Password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input
              type="password"
              placeholder="Verify your new password"
              name="passwordCheck"
              value={passwordCheck}
              onChange={e => setPasswordCheck(e.target.value)}
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