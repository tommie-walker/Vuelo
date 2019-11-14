import React, { useState, useContext } from 'react';
import { Icon, Drawer, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const NavHeader = (props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useContext(UserContext);
  console.log(user);

  function toggleMenu() {
    if (menuOpen) {
      setMenuOpen(false);
    } else {
      setMenuOpen(true);
    }
  }

  return (
    <h1></h1>
    // <>
    //   <Icon type="right-square" theme="twoTone" onClick={toggleMenu} className='menuIcon' />
    //   <div id='navHeader'>
    //     <Drawer
    //       placement='top'
    //       onClose={() => setMenuOpen(false)}
    //       visible={menuOpen}
    //       height='fit-content'
    //     >
    //       <Row>
    //         <Col span={user.token ? user.role === 'admin' ? 5 : 6 : 8} offset={1}>
    //           <Link to="/">
    //             <h1 className='drawerContentTitle navHeaderFont'><Icon type="home" />Home</h1>
    //           </Link>
    //         </Col>
    //         {user.role === "admin" ?
    //           <Col span={8}>
    //             <Link to="/addHeli">
    //               <h1 className='drawerContentTitle navHeaderFont'><Icon type="plus-circle" />Add Helicopter</h1>
    //             </Link>
    //           </Col>
    //           : ''}
    //         {user.token ?
    //           <>
    //             <Col span={user.role === 'admin' ? 4 : 3} offset={user.role === 'admin' ? 0 : 9}>
    //               <Link to={{
    //                 pathname: `/users/${user.username}`,
    //                 state: { user }
    //               }}>
    //                 <h1 className='drawerContentTitle navHeaderFont'><Icon type="user" />{user.username}</h1>
    //               </Link>
    //             </Col>
    //           </>
    //           : ""
    //         }
    //         {user.token ?
    //           <>
    //             <Col span={user.role === 'admin' ? 5 : 3}>
    //               <Link to='/' onClick={() => {
    //                 document.location.reload();
    //               }}>
    //                 <h1 className='drawerContentTitle navHeaderFont loginNav logout'><Icon type="profile" />Logout</h1>
    //               </Link>
    //             </Col>
    //           </>
    //           :
    //           <Col span={8} offset={6}>
    //             <Link to='/login'>
    //               <h1 className='drawerContentTitle navHeaderFont loginNav'><Icon type="profile" />Login</h1>
    //             </Link>
    //           </Col>
    //         }
    //       </Row>
    //     </Drawer>
    //   </div>
    // </>
  )
}

export default NavHeader;