import React, { useState, useContext } from 'react';
import { Icon, Drawer, Col, Row, message } from 'antd';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import Config from '../config/app.local.config';


const NavHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, updateUser } = useContext(UserContext);

  function userLogout() {
    const userAuth = { username: user.username }
    fetch(`${Config.authServiceUrl}Logout`, {
      method: `POST`,
      headers: {
        "Content-Type": "application/JSON"
      },
      body: JSON.stringify(userAuth)
    })
      .then(res => {
        if (!res.ok) { throw Error(res.statusText); }
      })
      .catch(err => {
        message.error('Something went wrong');
      });
  }

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
            <Col span={user.token ? user.role === 'admin' ? 5 : 5 : 8} offset={1}>
              <Link to="/">
                <h1 className='drawerContentTitle navHeaderFont'><Icon type="home" />Home</h1>
              </Link>
            </Col>
            {user.role === "admin" ?
              <Col span={8}>
                <Link to="/addHeli">
                  <h1 className='drawerContentTitle navHeaderFont'><Icon type="plus-circle" />Add Helicopter</h1>
                </Link>
              </Col>
              : ''}
            {user.token ?
              <>
                <Col span={user.role === 'admin' ? 5 : 5} offset={user.role === 'admin' ? 0 : 5}>
                  <Link to={{
                    pathname: `/users/${user.username}`,
                    state: { user }
                  }}>
                    <h1 className='drawerContentTitle navHeaderFont'><Icon type="user" />{user.username}</h1>
                  </Link>
                </Col>
              </>
              : ""
            }
            {user.token ?
              <>
                <Col span={user.role === 'admin' ? 5 : 5}>
                  <Link to='/' onClick={() => {
                    userLogout();
                    updateUser({});
                  }}>
                    <h1 className='drawerContentTitle navHeaderFont loginNav logout'><Icon type="profile" />Logout</h1>
                  </Link>
                </Col>
              </>
              :
              <Col span={8} offset={6}>
                <Link to='/login'>
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