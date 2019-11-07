import React, { useState } from "react";
import { Input, Button, Form, notification, List, Col, Row, message } from "antd";
import { useLocation } from "react-router";
import Config from "../config/app.local.config";
import Banner from '../NavHeader/banner';


const HeliDetailPage = () => {
  let location = useLocation();
  const heli = location.state.helicopter;
  const [heliUrl] = useState(heli.url);
  const [model, setmodel] = useState(heli.model);
  const [type, setType] = useState(heli.type);
  const [capacityWeight, setCapacityWeight] = useState(heli.capacityWeight);
  const [crewMax, setCrewMax] = useState(heli.crewMax);
  const [crewMin, setCrewMin] = useState(heli.crewMin);
  const [fuselageLength, setFuselageLength] = useState(heli.fuselageLength);
  const [heliHeight, setHeliHeight] = useState(heli.height);
  const [rotorDiam, setRotorDiameter] = useState(heli.rotorDiameter);
  const [maxSpeed, setMaxSpeed] = useState(heli.maxSpeed);
  const [auth] = useState(localStorage.getItem("token") || "");
  const [_id] = useState(heli._id);

  function deleteHeli() {
    fetch(`${Config.helicopterServiceUrl}${heli._id}`, {
      method: `DELETE`,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json'
      }
    })
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
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
      method: `PUT`,
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
      description: `Sorry about that! It will be back up and running in a jiffy! We were unable to add your class to the list.${err}`
    });
  }

  return (
    <>
      <div className='detailContent'>
        <Banner />
        {auth ? (
          <>
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
                  onChange={e => setmodel(e.target.value)}
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
            <>
              <Row>
                <Col span={24}>
                  <h6 className="big-title">
                    {type} {model}
                  </h6>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <img src={heliUrl ? heliUrl : require('../images/default.png')} className="detailImg" alt={model} />
                </Col>
                <Col span={12}>
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
            </>
          )}
      </div>
    </>
  );
};
export default HeliDetailPage;
