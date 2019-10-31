import React from 'react';
import { Form, Input, notification } from 'antd';
import Config from '../config/app.local.config';

function ChangePassword() {
  fetch(`${Config.userServiceUrl}forgotPassword`, {
    method: "POST",
    headers: "application/JSON"
  })
    .then(() => {
      console.log("success")
    })
    .catch(err => {
      notification.open('err')
    })
  return (
    <Form >
      <Form.Item>
        <Input />
      </Form.Item>
    </Form>
  )
}

export default ChangePassword;