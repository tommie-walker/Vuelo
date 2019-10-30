import React, { useState } from "react";
import { Input, Button, Form } from "antd";
import Config from "../config/app.local.config";
import Banner from '../NavHeader/banner';

function AddHeli(props) {
  const [heliModel, setHeliModel] = useState();
  const [type, setType] = useState();
  const [capWeight, setCapWeight] = useState();
  const [crewMax, setCrewMax] = useState();
  const [crewMin, setCrewMin] = useState();
  const [fuseLength, setFuseLength] = useState();
  const [heliHeight, setHeliHeight] = useState();
  const [rotorDiam, setRotorDiam] = useState();
  const [src, setSrc] = useState();
  const [maxSpeed, setMaxSpeed] = useState();


  function clearFields() {
    setHeliModel("");
    setType("");
    setCapWeight("");
    setCrewMax("");
    setCrewMin("");
    setFuseLength("");
    setHeliHeight("");
    setRotorDiam("");
    setSrc("");
    setMaxSpeed("");
  }

  function addNewHelicopter() {

    const newHeli = { type, heliModel, capWeight, crewMax, crewMin, fuseLength, heliHeight, rotorDiam, src, maxSpeed };


    fetch(`${Config.helicopterServiceUrl}`, {
      method: `POST`,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newHeli)
    })
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        clearFields();
      })
      .catch(err => {
        props.handleError(err);
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
              onChange={e => setType(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input
              type="text"
              placeholder="Model"
              name="heliModel"
              value={heliModel}
              onChange={e => setHeliModel(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Input
              type="text"
              placeholder="Capcity Weight"
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
              placeholder="Image Source"
              name="src"
              value={src}
              onChange={e => setSrc(e.target.value)}
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
