import React, { useState, useContext } from "react";
import { Input, Button, Form, notification, message } from "antd";
import Config from "../config/app.local.config";
import Banner from '../NavHeader/banner';
import { UserContext } from '../contexts/UserContext';

function AddHeli(props) {
  const { user } = useContext(UserContext);
  const [model, setModel] = useState();
  const [type, setType] = useState();
  const [capWeight, setCapWeight] = useState();
  const [crewMax, setCrewMax] = useState();
  const [crewMin, setCrewMin] = useState();
  const [fuseLength, setFuseLength] = useState();
  const [heliHeight, setHeliHeight] = useState();
  const [rotorDiam, setRotorDiam] = useState();
  const [url, setUrl] = useState();
  const [maxSpeed, setMaxSpeed] = useState();


  function clearFields() {
    setModel("");
    setType("");
    setCapWeight("");
    setCrewMax("");
    setCrewMin("");
    setFuseLength("");
    setHeliHeight("");
    setRotorDiam("");
    setUrl("");
    setMaxSpeed("");
  }

  function addNewHelicopter() {
    const newHeli = { type, model, capacityWeight: capWeight, crewMax, crewMin, fuselageLength: fuseLength, height: heliHeight, rotorDiameter: rotorDiam, url, maxSpeed, username: user.username, token: user.token };
    fetch(`${Config.authServiceUrl}AddHeli`, {
      method: `POST`,
      headers: {
        "Content-Type": "application/JSON"
      },
      body: JSON.stringify(newHeli)
    })
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        message.success('Your helicopter was saved!');
        clearFields();
      })
      .catch(err => {
        notification.open(err);
      });
  }

  return (
    <>
      <div className='mainContent'>
        <Banner />
        <h6 className='big-title'>Add a Helicopter</h6>
        <Form
          className='inputForm'
          onSubmit={event => {
            event.preventDefault();
            addNewHelicopter();
          }}
        >
          <Form.Item>
            <Input
              type="text"
              placeholder="Type"
              name="type"
              value={type}
              required={true}
              onChange={e => setType(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input
              type="text"
              placeholder="Model"
              name="heliModel"
              value={model}
              required={true}
              onChange={e => setModel(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input
              type="text"
              placeholder="Capacity Weight"
              name="capWeight"
              value={capWeight}
              onChange={e => setCapWeight(e.target.value)}
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
              name="fuseLength"
              value={fuseLength}
              onChange={e => setFuseLength(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input
              type="text"
              placeholder="Height"
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
              onChange={e => setRotorDiam(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input
              type="text"
              placeholder="Max Speed"
              name="maxSpeed"
              value={maxSpeed}
              onChange={e => setMaxSpeed(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input
              type="text"
              placeholder="Image URL"
              name="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="addHeliButton">
            Submit
        </Button>
        </Form>
      </div>
    </>
  );
}

export default AddHeli;
