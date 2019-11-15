import React, { createContext, useState } from 'react';

export const HelicopterContext = createContext();

const HelicopterContextProvider = props => {
  const [helis, setHelis] = useState([]);

  const updateHelis = updatedHeli => {
    setHelis([...updatedHeli]);
  }

  return (
    <HelicopterContext.Provider value={{ helis, updateHelis }}>
      {props.children}
    </HelicopterContext.Provider>
  );
}

export default HelicopterContextProvider;
