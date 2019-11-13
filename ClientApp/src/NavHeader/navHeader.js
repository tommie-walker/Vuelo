import React, { useState } from 'react';
import { Icon, Drawer, Col, Row } from 'antd';
import { Link } from 'react-router-dom';

const NavHeader = (props) => {
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
            <Col span={props.user.token ? props.user.role === 'admin' ? 5 : 6 : 8} offset={1}>
              <Link to="/">
                <h1 className='drawerContentTitle navHeaderFont'><Icon type="home" />Home</h1>
              </Link>
            </Col>
            {props.user.role === "admin" ?
              <Col span={8}>
                <Link to="/addHeli">
                  <h1 className='drawerContentTitle navHeaderFont'><Icon type="plus-circle" />Add Helicopter</h1>
                </Link>
              </Col>
              : ''}
            {props.user.token ?
              <>
                <Col span={props.user.role === 'admin' ? 4 : 3} offset={props.user.role === 'admin' ? 0 : 9}>
                  <Link to={{
                    pathname: `/users/${props.user.username}`,
                    state: { user: props.user }
                  }}>
                    <h1 className='drawerContentTitle navHeaderFont'><Icon type="user" />{props.user.username}</h1>
                  </Link>
                </Col>
              </>
              : ""
            }
            {props.user.token ?
              <>
                <Col span={props.user.role === 'admin' ? 5 : 3}>
                  <Link to='/' onClick={() => {
                    localStorage.removeItem('username');
                    localStorage.removeItem('favorites');
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    document.location.reload();
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