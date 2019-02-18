import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import * as serviceWorker from './serviceWorker';
import './index.sass';

/* ------------------------------------------------------------------- */
/*                              Config
/* ------------------------------------------------------------------- */

// =====> Routes
import * as routes from './config/routes';

// =====> Axios
import axios from 'axios';

/* ------------------------------------------------------------------- */
/*                              Import My Components
/* ------------------------------------------------------------------- */

// =====> Main Container
import Main from './components/Main';

// =====> Loader
import Loader from './components/Loader';

// =====> Unprotected routes
import Home from './containers/Home';
import Register from './containers/Register';
import Login from './containers/Login';
import ResetPwd from './containers/ResetPwd';

// =====> Not Found
import NotFound from './containers/NotFound';

// =====> Protected routes
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

import { FbContext, withAuth } from './config/store';
import Firebase from './config/firebase';

/* ------------------------------------------------------------------- */
/*                              ReactDOM.render
/* ------------------------------------------------------------------- */

// =====> Component to render. Holds Router
class App extends Component {
  render() {
    return (
      <FbContext.Provider value={new Firebase()}>
        <Router>
            <Routes />
        </Router>
      </FbContext.Provider>
    )
  };
};

// =====> Routes under Firebase Auth validation
class Routes extends Component {
  render() {
    // Receive authUser prop
    const { authUser } = this.props;

    // Set default header for request via axios
    if (authUser) axios.defaults.headers.common['userid'] = authUser.email;

    return (
      <Switch>
        <Route path={routes.HOME} exact component={Home} />
        <Route path={routes.REGISTER} exact component={Register} />
        <Route path={routes.LOGIN} exact component={Login} />
        <Route path={routes.RESET_PWD} exact component={ResetPwd} />
        {authUser
          ? <Main>
              <Switch>
                <Route exact path={routes.PROFILE} component={Profile} />
                <Route exact path={routes.DASHBOARD} component={Dashboard} />
                <Route exact path={routes.MENU} component={Menu} />
                <Route exact path={routes.MENU_ITEM} component={MenuItem} />
                <Route exact path={routes.DISHES} component={Dishes} />
                <Route exact path={routes.DISH} component={Dish} />
                <Route exact path={routes.PRODUCTS} component={Products} />
                <Route exact path={routes.PRODUCT} component={Product} />
                <Route component={NotFound} />
              </Switch>
            </Main>
          : <Switch>
              <Route path='*' component={Loader} />
            </Switch>
        }
        <Route component={NotFound} />
      </Switch>
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
