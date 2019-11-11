import React from 'react';
import { Row, Col } from "antd";
import { Link } from 'react-router-dom';

import NavHeader from '../NavHeader/navHeader';

export default function Banner() {
  return (
    <Row className='header'>
      <Col span={1} offset={2}>
        <Link to='/'>
          <h1 className="big-title">
            Vuelo
            </h1>
        </Link>
      </Col>

      <Col span={1} offset={18}>
        <NavHeader />
      </Col>
    </Row>
  )
}