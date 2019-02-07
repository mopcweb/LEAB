import React, { createContext } from 'react';

/* ------------------------------------------------------- */
/*                          Global
/* ------------------------------------------------------- */

const menu = {
  title: 'Menu',
  changeTitle: (e) => {
    menu.title = e.target.value;
  }
};

export const store = {
  menu: menu,
};

export const Context = createContext(store);

/* ------------------------------------------------------- */
/*                        Firebase
/* ------------------------------------------------------- */

export const FbContext = createContext(null);

export const withFirebase = Component => props => (
  <FbContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FbContext.Consumer>
);
