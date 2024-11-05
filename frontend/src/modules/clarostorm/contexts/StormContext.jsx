import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [likesCount, setLikesCount] = useState(0);
  const [ideas, setIdeas] = useState([]);

  return (
    <AppContext.Provider value={{ likesCount, setLikesCount, ideas, setIdeas }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
