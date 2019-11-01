import React, { useState } from 'react';
import { Form, Input, notification, Button, Card, Avatar } from 'antd';
import Config from '../config/app.local.config';

import Banner from '../NavHeader/banner';

function ForgotPassword() {
  const [email, setEmail] = useState();
  const [emailSent, setEmailSent] = useState(false);

  function handleChange(value) {
    setEmail(value);
  }

  function sendEmail() {
    fetch(`${Config.userServiceUrl}userForgotPassword`, {
      method: 'POST',
      headers: { type: 'application/JSON' },
      body: JSON.stringify(email)
    })
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        setEmailSent(true)
      })
      .catch(err => {
        notification.open(err)
      })
  }

  return (
    <div className='mainContent smallContent'>
      <Banner />
      <Card className="loginCard">
        <Avatar size={120} className="loginIcon" icon="user" />
        {!emailSent ?
          <>
            <h1 className="big-title">Forgot Password?</h1>
            <Form
              onSubmit={e => {
                e.preventDefault();
              }}>
              <Form.Item>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  name="email"
                  value={email}
                  onChange={e => handleChange(e.target.value)}
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                onClick={sendEmail}
                className="loginButton"
              >
                Send Email
          </Button>
            </Form>
          </>
          :
          <h1>{`Thank You! Check ${email} for your password update email`}</h1>
        }
      </Card>
    </div>
  )
}

export default ForgotPassword;