import React, { useState, useEffect, useContext } from "react";
import { Input, Drawer, Button, Divider, Slider, Radio, notification } from "antd";
import { isEmpty } from "lodash";
import escapeStringRegexp from "escape-string-regexp";
import HelicopterList from "./helicopter-list";
import Config from '../config/app.local.config';
import Banner from "../NavHeader/banner";
import { HelicopterContext } from '../contexts/HelicopterContext';
import { AuthContext } from "../contexts/AuthContext";

function Helicopter() {
  const { Search } = Input;
  const { authenticate } = useContext(AuthContext);
  const { updateHelis } = useContext(HelicopterContext);
  const [helicopters, setHelicopters] = useState([])
  const [filtHeli, setFiltHeli] = useState(helicopters);
  const [typeSelected, setTypeSelected] = useState("All");
  const [visible, setVisible] = useState(false);
  const [capacityWeight, setCapacityWeight] = useState(1000);
  const [crewMax, setCrewMax] = useState(1);
  const [crewMin, setCrewMin] = useState(1);
  const [fuselageLength, setFuselageLength] = useState(1);
  const [heliHeight, setHeliHeight] = useState(1);
  const [rotorDiam, setRotorDiameter] = useState(10);
  const [maxSpeed, setMaxSpeed] = useState(1);

  function loadData() {
    fetch(`${Config.helicopterServiceUrl}`)
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then(h => {
        updateHelis(h);
        setFiltHeli(h);
        setHelicopters(h);
      })
      .catch(err => {
        handleError(err);
      });
  }

  useEffect(() => {
    authenticate();
    if (isEmpty(helicopters)) {
      loadData();
    }
  }, [helicopters])

  function handleError() {
    notification.open("Oh No! Something went wrong!");
  }

  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px"
  };

  const types = helicopters.map(h => h.type);
  const makeItems = types
    .filter(
      (h, index) => types.indexOf(h) === index
    )
    .map(t => (
      <Radio
        value={t}
        style={radioStyle}
        className='drawerContentTitle'
        key={t}
        onClick={() => handleType(t)}
      >
        {t}
      </Radio>
    ));

  function handleType(type) {
    const helisOfOneType = helicopters.filter(h => h.type === type);
    if (type === "All") {
      setTypeSelected("All");
      setFiltHeli(helicopters)
    }
    else {
      setTypeSelected(type)
      setFiltHeli(helisOfOneType);
    }
  }

  function handleChange(value) {
    let searchResults = ''
    if (value) {
      searchResults = helicopters.filter(h => h.model.search(escapeStringRegexp(value.toUpperCase())) === 0);
    }
    const sliderResults = helicopters.filter(h =>
      parseInt(h.capacityWeight) >= capacityWeight &&
      parseInt(h.crewMax) >= crewMax &&
      parseInt(h.crewMin) >= crewMin &&
      parseInt(h.fuselageLength) >= fuselageLength &&
      parseInt(h.height) >= heliHeight &&
      parseInt(h.rotorDiameter) >= rotorDiam &&
      parseInt(h.maxSpeed) >= maxSpeed
    );
    const filteredHelis = typeSelected === "All" ?
      searchResults ?
        searchResults : sliderResults
      :
      searchResults ?
        searchResults.filter(r => r.type === typeSelected) : sliderResults.filter(h => h.type === typeSelected);
    setFiltHeli(filteredHelis);
  }

  function showDrawer() {
    setVisible(true);
  }

  function onClose() {
    setVisible(false);
  }

  return (
    <div className='mainContent'>
      <Banner />
      <Search
        placeholder={`Search for Helicopters`}
        onChange={e => handleChange(e.target.value)}
        className="search"
        enterButton
      />
      <br />
      <Button type="primary" className="filterButton" onClick={showDrawer}>
        Filter Options
      </Button>
      <Drawer
        title="Filter Options"
        onClose={onClose}
        visible={visible}
        maskClosable={true}
        className="filterOptionDrawer"
      >
        <h3 className='drawerContentTitle'>Type</h3>
        <Radio.Group>
          <Radio
            value={"All"}
            style={radioStyle}
            defaultChecked={true}
            onClick={() => handleType("All")}
            className='drawerContentTitle'
          >
            All
          </Radio>
          {makeItems}
        </Radio.Group>
        <Divider />
        <span>
          <h3 className='drawerContentTitle'>Minimum Capacity Weight</h3>
          <p>{`${capacityWeight} pounds`}</p>
        </span>
        <Slider
          defaultValue={capacityWeight}
          min={1000}
          max={50000}
          onChange={setCapacityWeight}
          onAfterChange={() => handleChange('')}
        />
        <Divider />
        <span>
          <h3 className='drawerContentTitle'>Maximum Crew Members</h3>
          <p>{`${crewMax} ${crewMax === 1 ? "person" : "people"}`}</p>
        </span>
        <Slider
          defaultValue={crewMax}
          min={1}
          max={10}
          onChange={setCrewMax}
          onAfterChange={() => handleChange('')}
        />
        <Divider />
        <span>
          <h3 className='drawerContentTitle'>Minimum Crew Members</h3>
          <p>{`${crewMin} ${crewMin === 1 ? "person" : "people"}`}</p>
        </span>
        <Slider
          defaultValue={crewMin}
          min={1}
          max={15}
          onChange={setCrewMin}
          onAfterChange={() => handleChange('')}
        />
        <Divider />
        <span>
          <h3 className='drawerContentTitle'>Minimum Fuselage Length</h3>
          <p>{`${fuselageLength} meters`}</p>
        </span>
        <Slider
          defaultValue={fuselageLength}
          min={1}
          max={100}
          onChange={setFuselageLength}
          onAfterChange={() => handleChange('')}
        />
        <Divider />
        <span>
          <h3 className='drawerContentTitle'>Minimum Helicopter Height</h3>
          <p>{`${heliHeight} meters`}</p>
        </span>
        <Slider
          defaultValue={heliHeight}
          min={1}
          max={30}
          onChange={setHeliHeight}
          onAfterChange={() => handleChange('')}
        />
        <Divider />
        <span>
          <h3 className='drawerContentTitle'>Minimum Rotor Diameter</h3>
          <p>{`${rotorDiam} meters`}</p>
        </span>
        <Slider
          defaultValue={rotorDiam}
          min={10}
          max={100}
          onChange={setRotorDiameter}
          onAfterChange={() => handleChange('')}
        />
        <span>
          <h3 className='drawerContentTitle'>Minimum Top Speed</h3>
          <p>{`${maxSpeed} knot${maxSpeed === 1 ? "" : "s"}`}</p>
        </span>
        <Slider
          defaultValue={maxSpeed}
          min={1}
          max={300}
          onChange={setMaxSpeed}
          onAfterChange={() => handleChange('')}
        />
      </Drawer>
      {isEmpty(filtHeli) ?
        < div className='emptyResultMessage'>
          Sorry! Your search did not match any helicopters in our system.
        </div >
        :
        <HelicopterList helis={filtHeli} />
      }
    </div >
  );
}

export default Helicopter;
