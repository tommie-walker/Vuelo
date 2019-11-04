import React, { useState, useEffect } from "react";
import { Input, Drawer, Button, Divider, Slider, Radio, notification } from "antd";
import { isEmpty } from "lodash";
import escapeStringRegexp from "escape-string-regexp";
import Banner from '../NavHeader/banner';
import HelicopterList from "./helicopter-list";
import Config from '../config/app.local.config';

function Helicopter() {
  const { Search } = Input;
  const [helicopters, setHelicopters] = useState([])
  const [filtHeli, setFiltHeli] = useState();
  const [typeSelected, setTypeSelected] = useState("All");
  const [visible, setVisible] = useState(false);
  const [capacityWeight, setCapacityWeight] = useState(1000);
  const [crewMax, setCrewMax] = useState(1);
  const [crewMin, setCrewMin] = useState(1);
  const [fuselageLength, setFuselageLength] = useState(1);
  const [heliHeight, setHeliHeight] = useState(1);
  const [rotorDiam, setRotorDiameter] = useState(10);
  const [maxSpeed, setMaxSpeed] = useState(1);

  useEffect(() => {
    if (isEmpty(helicopters)) {
      loadData();
      setFiltHeli(helicopters);
    }
  }, [helicopters])

  function loadData() {
    fetch(`${Config.helicopterServiceUrl}`)
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res.json();
      })
      .then(h => {
        setHelicopters(h);
      })
      .catch(err => {
        handleError(err);
      });
  }

  function handleError() {
    notification.open("Oh No! Something went wrong!");
  }

  useEffect(() => {
    console.log(filtHeli)
  }, [filtHeli]);

  const radioStyle = {
    display: "block",
    height: "30px",
    lineHeight: "30px"
  };

  const allTypes = helicopters.map(h => h.type);
  const uniqueTypes = allTypes.filter(
    (r, index) => allTypes.indexOf(r) === index
  );
  const makeItems = uniqueTypes.map(t => (
    <Radio
      value={t}
      style={radioStyle}
      className='drawerContentTitle'
      key={t}
      onClick={() => handleSelected(t)}
    >
      {t}
    </Radio>
  ));

  function handleSearch(value) {
    const upperCaseSearchValue = value.toUpperCase()
    const escapedString = escapeStringRegexp(upperCaseSearchValue);
    const searchResults = helicopters.filter(h => h.model.search(escapedString) === 0);
    const filteredResults =
      typeSelected === "All"
        ? searchResults
        : searchResults.filter(
          r =>
            r.type === typeSelected &&
            r.capacityWeight >= capacityWeight &&
            r.crewMax >= crewMax &&
            r.crewMin >= crewMin &&
            r.fuselageLength >= fuselageLength &&
            r.height >= heliHeight &&
            r.rotorDiameter >= rotorDiam &&
            r.maxSpeed >= maxSpeed
        );
    setFiltHeli(filteredResults);
  }

  function handleSelected(type) {
    const helisOfOneType = helicopters.filter(h => h.type === type);
    setTypeSelected(type);
    setFiltHeli(helisOfOneType);
  }

  function handleSlider() {
    const sliderResults = helicopters.filter(h =>
      typeSelected === "All"
        ? parseInt(h.capacityWeight) >= capacityWeight &&
        parseInt(h.crewMax) >= crewMax &&
        parseInt(h.crewMin) >= crewMin &&
        parseInt(h.fuselageLength) >= fuselageLength &&
        parseInt(h.height) >= heliHeight &&
        parseInt(h.rotorDiameter) >= rotorDiam &&
        parseInt(h.maxSpeed) >= maxSpeed
        : h.type === typeSelected &&
        parseInt(h.capacityWeight) >= capacityWeight &&
        parseInt(h.crewMax) <= crewMax &&
        parseInt(h.crewMin) >= crewMin &&
        parseInt(h.fuselageLength) >= fuselageLength &&
        parseInt(h.height) >= heliHeight &&
        parseInt(h.rotorDiameter) >= rotorDiam &&
        parseInt(h.maxSpeed) >= maxSpeed
    );
    setFiltHeli(sliderResults);
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
        placeholder={`Search for${
          typeSelected === "All" || isEmpty(typeSelected)
            ? ""
            : ` ${typeSelected}`
          } Helicopters`}
        onChange={e => handleSearch(e.target.value)}
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
            onClick={() => handleSelected("All")}
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
          onAfterChange={handleSlider}
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
          onAfterChange={handleSlider}
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
          onAfterChange={handleSlider}
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
          onAfterChange={handleSlider}
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
          onAfterChange={handleSlider}
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
          onAfterChange={handleSlider}
        />
        <Divider />
        <h3 className='drawerContentTitle'>Engine Type</h3>
        <Divider />
        <span>
          <h3 className='drawerContentTitle'>Minimum Top Speed</h3>
          <p>{`${maxSpeed} knot${maxSpeed === 1 ? "" : "s"}`}</p>
        </span>
        <Slider
          defaultValue={maxSpeed}
          min={1}
          max={300}
          onChange={setMaxSpeed}
          onAfterChange={handleSlider}
        />
      </Drawer>
      <HelicopterList
        filtHeli={isEmpty(filtHeli) ? helicopters : filtHeli}
      />
    </div>
  );
}

export default Helicopter;
