import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';

/* ------------------------------------------------------------------- */
/*                           Service Worker
/* ------------------------------------------------------------------- */

import * as serviceWorker from './serviceWorker';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              Config
/* ------------------------------------------------------------------- */

// =====> Routes
import * as routes from './config/routes';

// ======> Axios
import axios from 'axios';

/* ------------------------------------------------------------------- */
/*                         Import My Components
/* ------------------------------------------------------------------- */

// =====> Main Container
import Main from './components/Main';

// =====> Loader
import Loader from './components/Loader';

// =====> Alert
import withAlert, { provideAlert } from './components/Alert';

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

import { FbContext, provideAuth } from './config/store';
import { provideLang } from './config/lang';
import Firebase from './config/firebase';

/* ------------------------------------------------------------------- */
/*                   Component to render. Holds Router
/* ------------------------------------------------------------------- */

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

/* ------------------------------------------------------------------- */
/*                 Routes under Firebase Auth validation
/* ------------------------------------------------------------------- */

class Routes extends Component {
  state = {
    loader: false
  }

  // ==================>                             <================== //
  //                  Lifecycle hook (just before render)
  // ==================>                             <================== //

  componentDidMount() {
    // Interceptor for all axios responses
    // To define internet and mongo connection
    axios.interceptors.response.use(
      res => res,
      err => {
        // If network error -> redirect to offline page
        if (err.response === undefined) {
          console.log('=====> You are offline <=====');

          // Sign out & redirect
          this.props.firebase.doSignOut()
            .then(this.props.history.push(routes.HOME))
        };

        // If connection Error
        if (err.response.status === 502) {
          // Show error
          this.props.showAlert('Mongo connection error', 'error', null, true)

          // Sign out & redirect
          this.props.firebase.doSignOut()
            .then(this.props.history.push(routes.HOME))

          // Define current location (should not be login/register/forgotPwd)
          // const location = [
          //   routes.LOGIN, routes.REGISTER, routes.FORGOT_PWD
          // ].find(item => item === window.location.pathname);

          // if (!location) {
            // Show error msg
            // this.alertService.show.call(this, 'alert', 'Mongo connection error', 'error');

            // Log out
            // setTimeout(this.handleLogOut, 5000);
          // };
        };

        // For debug in browser while dev
        if (err.response !== undefined) {
          err.response.data
            ? console.log(err.response.data)
            : console.log(err.response);
        }

        // Return promise reject with err
        return Promise.reject(err);
      }
    );

    // If authUser already received -> stop loader
    if (!!this.props.authUser) return this.setState({ loader: true })

    // Else run loader for 3s
    clearTimeout(this.timer)
    this.timer = setTimeout(() => this.setState({ loader: true }), 2000)
  }

  // ==================>                             <================== //
  //                 Lifecycle hook (just before destroy)
  // ==================>                             <================== //

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  // ==================>                             <================== //
  //                               Render
  // ==================>                             <================== //

  render() {
    return this.state.loader
      ? (
        <Switch>
          <Route path={routes.HOME} exact component={Home} />

          {this.props.authUser
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

                  <Redirect exact path={routes.REGISTER} to={routes.DASHBOARD} />
                  <Redirect exact path={routes.LOGIN} to={routes.DASHBOARD} />
                  <Redirect exact path={routes.RESET_PWD} to={routes.DASHBOARD} />

                  <Route component={NotFound} />
                </Switch>
              </Main>
            : <Switch>
                {/* <Route exact path={routes.PROFILE} component={Loader} />
                <Route exact path={routes.DASHBOARD} component={Loader} />
                <Route exact path={routes.MENU} component={Loader} />
                <Route exact path={routes.MENU_ITEM} component={Loader} />
                <Route exact path={routes.DISHES} component={Loader} />
                <Route exact path={routes.DISH} component={Loader} />
                <Route exact path={routes.PRODUCTS} component={Loader} />
                <Route exact path={routes.PRODUCT} component={Loader} /> */}

                <Redirect exact path={routes.PROFILE} to={routes.LOGIN} />
                <Redirect exact path={routes.DASHBOARD} to={routes.LOGIN} />
                <Redirect exact path={routes.MENU} to={routes.LOGIN} />
                <Redirect exact path={routes.MENU_ITEM} to={routes.LOGIN} />
                <Redirect exact path={routes.DISHES} to={routes.LOGIN} />
                <Redirect exact path={routes.DISH} to={routes.LOGIN} />
                <Redirect exact path={routes.PRODUCTS} to={routes.LOGIN} />
                <Redirect exact path={routes.PRODUCT} to={routes.LOGIN} />

                <Route exact path={routes.REGISTER} component={Register} />
                <Route exact path={routes.LOGIN} component={Login} />
                <Route exact path={routes.RESET_PWD} component={ResetPwd} />

                <Route component={NotFound} />
              </Switch>
          }
        </Switch>
      )
      : <Loader />
  };
};

// =====> Provide Alert, Auth & Lang to Routes component
Routes = provideAlert(withAlert(provideAuth(provideLang(Routes))));

/* ------------------------------------------------------------------- */
/*                             Render App
/* ------------------------------------------------------------------- */

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
