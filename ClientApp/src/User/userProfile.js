import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import Banner from '../NavHeader/banner';
import HelicopterList from '../Helicopter/helicopter-list';
import isEmpty from 'lodash';
import Config from '../config/app.local.config';
import { message } from 'antd';

const UserProfile = props => {
  let location = useLocation();
  const user = location.state.user;
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (isEmpty(favorites)) {
      loadFavorites();
    }
  }, []);

  function loadFavorites() {
    fetch(`${Config.helicopterServiceUrl}favorites/${user.username}`)
      .then(res => {
        return res.json();
      })
      .then(favs => {
        setFavorites(favs);
      })
      .catch(err => {
        message.error(`error: ${err}`)
      })
  }

  return (
    <div className='mainContent'>
      <h6 className="big-title">Your Favorites</h6>
      <HelicopterList helis={favorites} />}
    </div>
  )
}

export default UserProfile;