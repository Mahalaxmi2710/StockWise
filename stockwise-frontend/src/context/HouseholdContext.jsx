import { createContext, useContext, useState } from "react";

const HouseholdContext = createContext();

export const HouseholdProvider = ({ children }) => {
  const [households, setHouseholds] = useState([]);
  const [activeHousehold, setActiveHousehold] = useState(null);

  return (
    <HouseholdContext.Provider
      value={{
        households,
        setHouseholds,
        activeHousehold,
        setActiveHousehold,
      }}
    >
      {children}
    </HouseholdContext.Provider>
  );
};

export const useHousehold = () => useContext(HouseholdContext);
