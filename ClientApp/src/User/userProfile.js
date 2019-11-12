import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Banner from '../NavHeader/banner';
import HelicopterList from '../Helicopter/helicopter-list';
import isEmpty from 'lodash';
import Config from '../config/app.local.config';

const UserProfile = props => {
  let location = useLocation();
  const user = location.state.user;
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    if (isEmpty(favorites)) {
      loadFavorites();
    }
  });

  function loadFavorites() {
    fetch(`${Config.helicopterServiceUrl}Favorites/${user.username}`)
      .then(res => {
        return res.json();
      })
      .then(favs => {
        setFavorites(favs)
      })
  }

  return (
    <div className='mainContent'>
      <Banner />
      <h6 className="big-title">Your Favorites</h6>
      {isEmpty(favorites) ?
        < div className='emptyResultMessage'>You don't have any favorites saved yet! Try adding some so you can find them with ease!</div >
        :
        <HelicopterList helis={favorites} />}
    </div>
  )
}

export default UserProfile;