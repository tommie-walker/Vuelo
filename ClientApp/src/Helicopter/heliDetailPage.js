import React, { useState, useContext, useEffect } from "react";
import { Input, Button, Form, notification, List, Col, Row, message } from "antd";
import { useParams, useHistory } from "react-router";
import config from "../config/app.local.config";
import Banner from '../NavHeader/banner';
import { UserContext } from "../contexts/UserContext";
import { HelicopterContext } from '../contexts/HelicopterContext';
import { AuthContext } from '../contexts/AuthContext';
import { isEmpty } from 'lodash';

const HeliDetailPage = () => {
  let history = useHistory();
  const urlParams = useParams();
  const heliId = urlParams._id;
  const { helis } = useContext(HelicopterContext);
  const { user, updateUser } = useContext(UserContext);
  const [heliUrl, setHeliUrl] = useState('');
  const [type, setType] = useState('');
  const [model, setModel] = useState('');
  const [capacityWeight, setCapacityWeight] = useState('');
  const [crewMax, setCrewMax] = useState('');
  const [crewMin, setCrewMin] = useState('');
  const [fuselageLength, setFuselageLength] = useState('');
  const [heliHeight, setHeliHeight] = useState('');
  const [rotorDiam, setRotorDiameter] = useState('');
  const [maxSpeed, setMaxSpeed] = useState('');
  const [_id, setId] = useState('');
  const [favorite, setFavorite] = useState();
  const heli = helis.filter(h => heliId === h._id);

  useEffect(() => {
    getHelicopter();
  }, []);



  function getHelicopter() {
    fetch(`${config.helicopterServiceUrl}getOne/${heliId}`)
      .then(res => {
        if (!res.ok) throw Error(res.statusText);
        return res.json();
      })
      .then(h => {
        setHeliUrl(h.url)
        setModel(h.model)
        setType(h.type)
        setCapacityWeight(h.capacityWeight)
        setCrewMax(h.crewMax)
        setCrewMin(h.crewMin)
        setFuselageLength(h.fuselageLength)
        setHeliHeight(h.height)
        setRotorDiameter(h.rotorDiameter)
        setMaxSpeed(h.maxSpeed)
        setId(h._id)
        setFavorite(user.favorites.includes(h.model))
      })
      .catch((err) => {
        message.error('Could not find your helicopter');
      })
  }

  function addFavorite() {
    if (!user.username) history.push('/login');
    if (favorite) return
    const userFav = { model, username: user.username, token: user.token }
    fetch(`${config.authServiceUrl}AddUserFavorite`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json'
      },
      body: JSON.stringify(userFav)
    }).then(res => {
      if (!res.ok) throw Error(res.statusText);
      setFavorite(true);
      updateUser({ ...user, favorites: [...user.favorites, model] });
    })
      .catch(() => {
        if (!user.username) return
        message.error("Could not be added to favorites")
      })
  };


  function removeFavorite() {
    const userFav = { model, username: user.username, token: user.token }
    const removedFavoriteArray = user.favorites.filter(m => !model === m);
    console.log(user.favorites.filter(m => model !== m))
    fetch(`${config.authServiceUrl}DeleteUserFavorite`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json'
      },
      body: JSON.stringify(userFav)
    }).then(res => {
      if (!res.ok) throw Error(res.statusText);
      setFavorite(false);
      updateUser({ ...user, favorites: removedFavoriteArray })
    })
      .catch(() => {
        message.error("Could not be removed from favorites")
      })
  };

  function deleteHeli() {
    const authHeli = { heliId: _id, username: user.username, token: user.token }
    fetch(`${config.authServiceUrl}DeleteHeli`, {
      method: `DELETE`,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json'
      },
      body: JSON.stringify(authHeli)
    })
      .then(res => {
        if (!res.ok) throw Error(res.statusText);
        message.success('Your helicopter was deleted!');
      })
      .catch(err => {
        notification["error"]({
          message: "Oh No! Something went wrong!",
          description: `Sorry about that! Your Helicopter was not deleted ${err}`
        });
      });
  }

  function updateHelicopter() {
    const authHeli = { heliId: _id, type, model, capacityWeight, crewMax, crewMin, fuselageLength, height: heliHeight, rotorDiameter: rotorDiam, maxSpeed, username: user.username, token: user.token, };
    fetch(`${config.authServiceUrl}UpdateHeli`, {
      method: `POST`,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify(authHeli)
    })
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        message.success('Your helicopter was updated!');
      })
      .catch(err => {
        handleError(err);
      });
  }

  function handleError(err) {
    notification["error"]({
      message: "Oh No! Something went wrong!",
      description: `Sorry about that! It will be back up and running in a jiffy!`
    });
  }

  return (
    <>
      <div className='detailContent'>
        {user.role === 'admin' ? (
          <>
            <Banner />
            <h6 className="big-title">Edit Helicopter</h6>
            <Form
              onSubmit={event => {
                event.preventDefault();
                updateHelicopter();
              }}
            >
              <Form.Item>
                <Input
                  type="text"
                  placeholder="Type"
                  name="type"
                  value={type}
                  onChange={e => setType(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Input
                  type="text"
                  placeholder="Model"
                  name="model"
                  value={model}
                  onChange={e => setModel(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Input
                  type="text"
                  placeholder="Capacity Weight"
                  name="capacityWeight"
                  value={capacityWeight}
                  onChange={e => setCapacityWeight(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Input
                  type="text"
                  placeholder="Crew Maximum"
                  name="crewMax"
                  value={crewMax}
                  onChange={e => setCrewMax(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Input
                  type="text"
                  placeholder="Crew Minimum"
                  name="crewMin"
                  value={crewMin}
                  onChange={e => setCrewMin(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Input
                  type="text"
                  placeholder="Fuselage Length"
                  name="fuselageLength"
                  value={fuselageLength}
                  onChange={e => setFuselageLength(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Input
                  type="text"
                  placeholder="Helicopter Height"
                  name="heliHeight"
                  value={heliHeight}
                  onChange={e => setHeliHeight(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Input
                  type="text"
                  placeholder="Rotor Diameter"
                  name="rotorDiam"
                  value={rotorDiam}
                  onChange={e => setRotorDiameter(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Input
                  type="text"
                  placeholder="Max Speed"
                  name=""
                  value={maxSpeed}
                  onChange={e => setMaxSpeed(e.target.value)}
                />
              </Form.Item>
              <span>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="action-button"
                >
                  Submit
              </Button>
                <Button
                  type="danger"
                  onClick={deleteHeli}
                  className="action-button"
                >
                  Delete
              </Button>
              </span>
            </Form>
          </>
        ) : (
            <div style={{
              backgroundImage: `url("${heliUrl}")`,
              postion: 'fixed',
              repeat: 'none',
              display: 'block',
              overflow: 'auto',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundAttachment: 'fixed',
              width: '100vw',
              height: '100vh',
            }}>
              <Banner />
              <Row justify='center'>
                <Col span={24}>
                  <h6 className="big-title">
                    {type} {model}
                  </h6>
                </Col>
              </Row>
              {
                favorite ?
                  <Button onClick={removeFavorite}>Remove Favorite</Button> :
                  <Button onClick={addFavorite}>Add to Favorites</Button>
              }

              <Row justify='center'>
                <Col
                  span={20}
                  offset={2}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.85)'
                  }}
                >
                  <List
                    bordered
                    itemLayout="horizontal"
                    grid={{
                      gutter: 40,
                      xs: 1,
                      sm: 2,
                      md: 3,
                      lg: 4,
                      xl: 4
                    }}
                  >
                    <List.Item className='detailListItem'>
                      <p>{`Type: ${type}`}</p>
                    </List.Item>
                    <List.Item className='detailListItem'>
                      <p>{`Model: ${model}`}</p>
                    </List.Item>
                    <List.Item className='detailListItem'>
                      <p>{`Capacity Weight: ${capacityWeight}`}</p>
                    </List.Item>
                    <List.Item className='detailListItem'>
                      <p>{`Crew Maximum: ${crewMax}`}</p>
                    </List.Item>
                    <List.Item className='detailListItem'>
                      <p>{`Crew Minimum: ${crewMin}`}</p>
                    </List.Item>
                    <List.Item className='detailListItem'>
                      <p>{`Fuselage Length: ${fuselageLength}`}</p>
                    </List.Item>
                    <List.Item className='detailListItem'>
                      <p>{`Helicopter Height: ${heliHeight}`}</p>
                    </List.Item>
                    <List.Item className='detailListItem'>
                      <p>{`Rotor Diameter: ${rotorDiam}`}</p>
                    </List.Item>
                    <List.Item className='detailListItem'>
                      <p>{`Max Speed: ${maxSpeed}`}</p>
                    </List.Item>
                  </List>
                </Col>
              </Row>
            </div>
          )}
      </div>
    </>
  );
};
export default HeliDetailPage;