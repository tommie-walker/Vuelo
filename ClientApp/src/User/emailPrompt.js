import React, { useState } from 'react';
import { Form, Input, message, Button, Card, Avatar } from 'antd';
import Config from '../config/app.local.config';

import Banner from '../NavHeader/banner';

function ForgotPassword(props) {
  const [email, setEmail] = useState();
  const [emailSent, setEmailSent] = useState(false);

  function handleChange(value) {
    setEmail(value);
  }

  function sendEmail() {
    const Email = { email };
    fetch(`${Config.authServiceUrl}ForgotPassword`, {
      method: "POST",
      headers: { "Content-Type": "application/JSON" },
      accepts: "application/json",
      body: JSON.stringify(Email)
    })
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        setEmailSent(true)
      })
      .catch(err => {
        if (email) {
          message.error("We don't have that email on file.");
          setEmail('');
        }
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
                  placeholder="Enter the email address your account is registered with."
                  name="email"
                  required={true}
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