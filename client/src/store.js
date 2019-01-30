import { createContext } from 'react';

const menu = {
  title: 'Menu',
  changeTitle: (e) => {
    menu.title = e.target.value;
  }
};

const dashboard = {
  title: 'Dashboard'
};

export const store = {
  menu: menu,
  dashboard: dashboard
};

export const Context = createContext(store);
