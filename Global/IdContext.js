import React, { createContext, useState} from 'react';

const IdContext = createContext();

const IdProvider = ({children}) => {
    const [globUser, setGlobUser] = useState('');

    return(
        <IdContext.Provider value={{ globUser, setGlobUser}}>
            {children}
        </IdContext.Provider>
    );
};

export { IdContext, IdProvider};
