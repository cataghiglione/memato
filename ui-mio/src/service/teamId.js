import React, {Component, createContext, useContext, useState} from 'react';

export const MyContext = createContext();

export const TeamIdProvider = ({ children }) => {
    const [teamId, setTeamId] = useState(0);

    const changeMyVariable = (newValue) => {
        setTeamId(newValue);
    };

    return (
        <MyContext.Provider value={{ teamId, changeMyVariable }}>
            {children}
        </MyContext.Provider>
    );
};



