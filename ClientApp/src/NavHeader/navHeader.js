import React, { useState, useEffect } from 'react';
import { Icon, Drawer, Col, Row } from 'antd';
import { Link } from 'react-router-dom';

const NavHeader = (props) => {
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const auth = localStorage.getItem('token');
  const favorites = localStorage.getItem('favorites');
  const { user } = useState({ username, auth, role, favorites });
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    if (menuOpen) {
      setMenuOpen(false);
    } else {
      setMenuOpen(true);
    }
  }

  return (
    <>
      <Icon type="right-square" theme="twoTone" onClick={toggleMenu} className='menuIcon' />
      <div id='navHeader'>
        <Drawer
          placement='top'
          onClose={() => setMenuOpen(false)}
          visible={menuOpen}
          height='fit-content'
        >
          <Row>
            <Col span={auth ? 5 : 8} offset={1}>
              <Link to="/">
                <h1 className='drawerContentTitle navHeaderFont'><Icon type="home" />Home</h1>
              </Link>
            </Col>
            {role === "admin" ?
              <Col span={8}>
                <Link to="/addHeli">
                  <h1 className='drawerContentTitle navHeaderFont'><Icon type="plus-circle" />Add Helicopter</h1>
                </Link>
              </Col>
              : ''}
            {auth ?
              <>
                <Col span={8}>
                  <Link to={{
                    pathname: `/users/${username}`,
                    state: { user: user }
                  }}>
                    <h1 className='drawerContentTitle navHeaderFont'><Icon type="profile" />{username}</h1>
                  </Link>
                </Col>
              </>
              : ""
            }
            {auth ?
              <>
                <Col span={8} offset={1}>
                  <Link to='/' onClick={() => {
                    localStorage.removeItem('username');
                    localStorage.removeItem('favorites');
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    document.location.reload();
                  }}>
                    <h1 className='drawerContentTitle navHeaderFont loginNav'><Icon type="profile" />Logout</h1>
                  </Link>
                </Col>
              </>
              :
              <Col span={8} offset={6}>
                <Link to={{
                  pathname: '/login',
                  state: { users: props.users }
                }}>
                  <h1 className='drawerContentTitle navHeaderFont loginNav'><Icon type="profile" />Login</h1>
                </Link>
              </Col>
            }
          </Row>
        </Drawer>
      </div>
    </>
  )
}

export default NavHeader;