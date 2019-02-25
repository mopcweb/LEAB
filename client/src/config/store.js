import React, { createContext } from 'react';
import { withRouter } from 'react-router-dom';

/* ------------------------------------------------------------------- */
/*                              Config
/* ------------------------------------------------------------------- */

// =====> Routes
import * as routes from './routes';

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






//
