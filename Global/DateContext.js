import React, { createContext, useState} from 'react';

const DateContext = createContext();

const DateProvider = ({children}) => {
    const [ deadline, setDeadline ] = useState(new Date());

    return(
        <DateContext.Provider value={{ deadline, setDeadline }}>
            {children}
        </DateContext.Provider>
    );
};

export { DateContext, DateProvider };