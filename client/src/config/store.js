import React, { createContext } from 'react';
import { withRouter } from 'react-router-dom';

import axios from 'axios';

/* ------------------------------------------------------------------- */
/*                              Config
/* ------------------------------------------------------------------- */

// =====> Routes
import * as routes from './routes';

// =====> API
import * as api from './api';

/* ------------------------------------------------------------------- */
/*                             Firebase
/* ------------------------------------------------------------------- */

// =====> Firebase Context
export const FbContext = createContext(null);

// =====> Firebase HOC
export const withFirebase = Component => props => (
  <FbContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FbContext.Consumer>
);

/* ------------------------------------------------------------------- */
/*                              withAuth
/* ------------------------------------------------------------------- */

// =====> AuthUser Context
export const AuthContext = createContext(null);

// =====> AuthUser HOC
export const withAuth = Component => {
  class WithAuth extends React.Component {
    constructor(props) {
      super(props);

      // =====> State
      this.state = {
        authUser: null
      };
    }

    // ==================>                             <================== //
    //                  Check if there is user logged in
    // ==================>                             <================== //

    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        authUser => {
          authUser
            ? this.handleUserLoggedIn(authUser)
            : this.handleUserLoggedOut()
      });
    }

    // ==================>                             <================== //
    //   If user logged in -> change state & store user into localStorage
    // ==================>                             <================== //

    handleUserLoggedIn = (authUser) => {
      // Save current user
      this.setState({ authUser });

      // Save current user lo localStorage
      window.localStorage.setItem('token', JSON.stringify(authUser));

      // Receive router props
      const { location, history } = this.props;

      // If user logged in -> redirect from Login, Register & Reset pwd pages
      if (location.pathname === routes.LOGIN) history.push(routes.DASHBOARD)
      if (location.pathname === routes.REGISTER) history.push(routes.DASHBOARD)
      if (location.pathname === routes.RESET_PWD) history.push(routes.DASHBOARD)
    }

    // ==================>                             <================== //
    //   If user logged out -> clear localStorage & redirect to Home page
    // ==================>                             <================== //

    handleUserLoggedOut = () => {
      // Reset current user
      this.setState({ authUser: null });

      // Clear localStorage
      window.localStorage.clear();

      // Redirect to Home page
      this.props.history.push(routes.HOME);
    }

    // ==================>                             <================== //
    //                Remove listener on component destroy
    // ==================>                             <================== //

    componentWillUnmount() {
      this.listener();
    }

    // ==================>                             <================== //
    //                               Render
    // ==================>                             <================== //

    render() {
      return (
        <AuthContext.Provider value={this.state.authUser}>
          <AuthContext.Consumer>
            {authUser => <Component {...this.props} authUser={authUser} />}
          </AuthContext.Consumer>
        </AuthContext.Provider>
      );
    }
  };

  // ==================>                             <================== //
  //                    Apply Firebase & Router props
  // ==================>                             <================== //

  return withRouter(withFirebase(WithAuth));
};

/* ------------------------------------------------------------------- */
/*                              withUser
/* ------------------------------------------------------------------- */

// =====> currentUser HOC
export const withUser = Component => props => (
  <AuthContext.Consumer>
    {authUser => <Component {...props} authUser={authUser} />}
  </AuthContext.Consumer>
);

/* ------------------------------------------------------------------- */
/*                         Languages Context
/* ------------------------------------------------------------------- */

// =====> Contexts For Lang
const LangContext = createContext(null);
const ChangeLangContext = createContext(null);

export const provideLang = Component => {
  class ProvideLang extends Component {
    constructor(props) {
      super(props);

      this.state = {
        lang: ''
      };
    }

    async componentDidMount() {


    }

    // =====> changeLang Handler which is passed into profile
    changeLang = async () => {
      // Stop running is there is no authUser
      if (!this.props.authUser) return;

      // Get email variable from authUser
      const { email } = this.props.authUser;

      // Get current user lang
      await axios
        .get(api.USERS + '/' + email)
        .then(res => this.lang = res.data.lang)
        .catch(err => console.log(err.response));

      // Get data for this lang
      await axios
        .get(api.LANGS + '/' + this.lang)
        .then(res => this.setState({ lang: res.data }))
        .catch(err => console.log(err.response));

      // Console for debug
      console.log(this.state.lang)
    }

    // =====> Here we look for authUser received & do first lang download
    componentDidUpdate(prevProps, prevState) {
      if (prevProps.authUser !== this.props.authUser) {
        this.changeLang()
      };
    }

    componentWillUnmount() {
      this.changeLang = null
    }

    render() {
      return (
        <LangContext.Provider value={this.state.lang}>
          <ChangeLangContext.Provider value={this.changeLang}>
            {/* <AuthContext.Consumer>
              {authUser => <Component {...this.props} authUser={authUser} />}
            </AuthContext.Consumer> */}
            <Component {...this.props} />
          </ChangeLangContext.Provider>
        </LangContext.Provider>
      )
    }
  };

  return withUser(ProvideLang)
};

// =====> Provide lang to Component
export const withLang = Component => props => (
  <LangContext.Consumer>
    {lang => <Component {...props} lang={lang} />}
  </LangContext.Consumer>
);

// =====> Provide changeLang handler to Component
export const changeLang = Component => props => (
  <ChangeLangContext.Consumer>
    {changeLang => <Component {...props} changeLang={changeLang} />}
  </ChangeLangContext.Consumer>
);







//
