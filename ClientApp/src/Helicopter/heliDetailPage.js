import React, { useState, useContext, useEffect } from "react";
import { Input, Button, Form, notification, List, Col, Row, message } from "antd";
import { useParams, useHistory } from "react-router";
import Config from "../config/app.local.config";
import Banner from '../NavHeader/banner';
import { UserContext } from "../contexts/UserContext";
import { HelicopterContext } from '../contexts/HelicopterContext';

const HeliDetailPage = () => {
  let history = useHistory();
  const urlParams = useParams();
  const heliId = urlParams._id;
  const { helis } = useContext(HelicopterContext);
  const { user, updateUser } = useContext(UserContext);

  const [heli, setHeli] = useState(helis.filter(h => heliId === h._id))

  const [heliUrl] = useState(heli[0].url);
  const [model, setModel] = useState(heli[0].model);
  const [type, setType] = useState(heli[0].type);
  const [capacityWeight, setCapacityWeight] = useState(heli[0].capacityWeight);
  const [crewMax, setCrewMax] = useState(heli[0].crewMax);
  const [crewMin, setCrewMin] = useState(heli[0].crewMin);
  const [fuselageLength, setFuselageLength] = useState(heli[0].fuselageLength);
  const [heliHeight, setHeliHeight] = useState(heli[0].height);
  const [rotorDiam, setRotorDiameter] = useState(heli[0].rotorDiameter);
  const [maxSpeed, setMaxSpeed] = useState(heli[0].maxSpeed);
  const [_id] = useState(heli[0]._id);

  const [favorite, setFavorite] = useState(user.favorites.includes(heli[0].model));

  useEffect(() => {
    if (!heli) handleRefresh();
  }, []);


  function addFavorite() {
    const userFav = { model, username: user.username }
    if (!user.username) history.push('/login');
    if (favorite) return
    fetch(`${Config.userServiceUrl}AddUserFavorite`, {
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

  function handleRefresh() {
    if (!favorite) return;
    fetch(`${Config.helicopterServiceUrl}GetOne/${heliId}`)
      .then(res => {
        if (!res.ok) throw Error(res.statusText);
        return res.json();
      })
      .then(h => {
        setHeli(h);
      })
      .catch((err) => {
        message.error('Could not find your helicopter');
      })
  }

  function removeFavorite() {
    const userFav = { model, username: user.username }
    fetch(`${Config.userServiceUrl}DeleteUserFavorite`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json'
      },
      body: JSON.stringify(userFav)
    }).then(res => {
      if (!res.ok) throw Error(res.statusText);
      setFavorite(false);
    })
      .catch(() => {
        message.error("Could not be removed from favorites")
      })
  };

  function deleteHeli() {
    fetch(`${Config.helicopterServiceUrl}${heli._id}`, {
      method: `DELETE`,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json'
      }
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
    const heli = { _id, type, model, capacityWeight, crewMax, crewMin, fuselageLength, height: heliHeight, rotorDiameter: rotorDiam, maxSpeed };
    fetch(`${Config.helicopterServiceUrl}${heli._id}`, {
      method: `PATCH`,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify(heli)
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
