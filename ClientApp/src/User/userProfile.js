import React from 'react';
import { useLocation } from 'react-router-dom';
import Banner from '../NavHeader/banner';
import HelicopterList from '../Helicopter/helicopter-list';

const UserProfile = props => {
  let location = useLocation();
  const user = location.state.user;
  return (
    <div className='mainContent'>
      <Banner />
      <h6 className="big-title">Your Favorites</h6>
      <HelicopterList helis={user.favorites} />
    </div>
  )
}

export default UserProfile;