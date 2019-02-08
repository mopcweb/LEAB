import React, { Component } from 'react';
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
import Register from './containers/Register';
import Login from './containers/Login';
import ResetPwd from './containers/ResetPwd';

import Profile from './containers/Profile';
import Dashboard from './containers/Dashboard';
import Menu from './containers/Menu';
import MenuItem from './containers/MenuItem';
import Dishes from './containers/Dishes';
import Dish from './containers/Dish';
import Products from './containers/Products';
import Product from './containers/Product';

/* ------------------------------------------------------------------- */
/*                        Import Context & Firebase
/* ------------------------------------------------------------------- */

import {store, Context, FbContext, withFirebase, AuthContext, withAuth } from './config/store';
import Firebase from './config/firebase';

/* ------------------------------------------------------------------- */
/*                              ReactDOM.render
/* ------------------------------------------------------------------- */

// =====> Component to render. Holds Router
class App extends Component {
  render() {
    return (
      <Router>
        <Context.Provider value={store}>
        <FbContext.Provider value={new Firebase()}>
          <Routes />
        </FbContext.Provider>
        </Context.Provider>
      </Router>
    )
  };
};

// =====> Component-consumer of (authUser)
class Routes extends Component {
  render() {
    return (
      <AuthContext.Consumer>
        {authUser => (
          <Switch>
            <Route path={routes.HOME} exact component={Home} />
            <Route path={routes.REGISTER} exact component={Register} />
            <Route path={routes.LOGIN} exact component={Login} />
            <Route path={routes.RESET_PWD} exact component={ResetPwd} />
            {authUser
              ? <Main>
                  <Route path={routes.PROFILE} component={Profile} />
                  <Route path={routes.DASHBOARD} component={Dashboard} />
                  <Route path={routes.MENU} exact component={Menu} />
                  <Route path={routes.MENU_ITEM} component={MenuItem} />
                  <Route path={routes.DISHES} exact component={Dishes} />
                  <Route path={routes.DISH} component={Dish} />
                  <Route path={routes.PRODUCTS} exact component={Products} />
                  <Route path={routes.PRODUCT} component={Product} />
                </Main>
              : null
            }
          </Switch>
        )}
      </AuthContext.Consumer>
    )
  };
};

// =====> Provide Auth to Routes component
Routes = withAuth(Routes);

// =====> Render App
ReactDOM.render(
  <App />,
  document.getElementById('root')
);

/* ------------------------------------------------------------------- */
/*                              Service workers
/* ------------------------------------------------------------------- */

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
