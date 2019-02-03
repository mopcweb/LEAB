import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import * as serviceWorker from './serviceWorker';
import './index.sass';

/* ------------------------------------------------------------------- */
/*                              Routes
/* ------------------------------------------------------------------- */

import * as routes from './config/routes';

/* ------------------------------------------------------------------- */
/*                              Import My Components
/* ------------------------------------------------------------------- */

import Main from './components/Main';
import Home from './containers/Home';
import Profile from './containers/Profile';
import Dashboard from './containers/Dashboard';
import Menu from './containers/Menu';
import MenuItem from './containers/MenuItem';
import Dishes from './containers/Dishes';
import Dish from './containers/Dish';
import Products from './containers/Products';

import Product from './containers/Product';

import {store, Context} from './store';

/* ------------------------------------------------------------------- */
/*                              Redux Store
/* ------------------------------------------------------------------- */

// import {createStore} from 'redux';
// import myApp from './reducers';
//
// import {chooseCurrency, CurrencyValues} from './actions'
//
// const store = createStore(myApp);
//
// console.log(store.getState())
//
// const unsubscribe = store.subscribe(() => console.log(store.getState()))
//
// store.dispatch(chooseCurrency('USD'))
// store.dispatch(chooseCurrency('EUR'))

/* ------------------------------------------------------------------- */
/*                              ReactDOM.render
/* ------------------------------------------------------------------- */

const App = (
  <Router>
    <Context.Provider value={store}>
      <Switch>
        <Route path={routes.HOME} exact component={Home} />
        <Main>
          <Route path={routes.PROFILE} component={Profile} />
          <Route path={routes.DASHBOARD} component={Dashboard} />
          <Route path={routes.MENU} exact component={Menu} />
          <Route path={routes.MENU_ITEM} component={MenuItem} />
          <Route path={routes.DISHES} exact component={Dishes} />
          <Route path={routes.DISH} component={Dish} />
          <Route path={routes.PRODUCTS} exact component={Products} />
          <Route path={routes.PRODUCT} component={Product} />
        </Main>
      </Switch>
    </Context.Provider>
  </Router>
)

ReactDOM.render(
  App,
  document.getElementById('root')
);

/* ------------------------------------------------------------------- */
/*                              Service workers
/* ------------------------------------------------------------------- */

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
