import React, { useState, useEffect, useContext } from 'react';
import Banner from '../NavHeader/banner';
import HelicopterList from '../Helicopter/helicopter-list';
import isEmpty from 'lodash';
import Config from '../config/app.local.config';
import { message } from 'antd';
import { UserContext } from '../contexts/UserContext';

function UserProfile() {
  const { user } = useContext(UserContext);
  const [favorites, setFavorites] = useState();

  useEffect(() => {
    loadFavorites();
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
      <Banner />
      <h6 className="big-title">Your Favorites</h6>
      <HelicopterList helis={favorites} />
    </div>
  )
}

export default UserProfile;