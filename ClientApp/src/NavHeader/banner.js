import React, { useContext } from 'react';
import { Row, Col } from "antd";
import { Link } from 'react-router-dom';
import NavHeader from '../NavHeader/navHeader';
import { UserContext } from '../contexts/UserContext';

export default function Banner() {
  const { user } = useContext(UserContext);
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
        <NavHeader user={user} />
      </Col>
    </Row>
  )
}