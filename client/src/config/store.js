import React, { createContext } from 'react';
import { withRouter } from 'react-router-dom';

/* ------------------------------------------------------------------- */
/*                              Config
/* ------------------------------------------------------------------- */

// =====> Routes
import * as routes from './routes';

/* ------------------------------------------------------------------- */
/*                            Firebase
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

/* ------------------------------------------------------------------- */
/*                        provideAuth HOC
/* ------------------------------------------------------------------- */

export const provideAuth = Component => {
  class Auth extends React.Component {
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
        async authUser => authUser
          ? await this.handleUserLoggedIn(authUser)
          : this.handleUserLoggedOut() );
    }

    // ==================>                             <================== //
    //   If user logged in -> change state & store user into localStorage
    // ==================>                             <================== //

    handleUserLoggedIn = async authUser => {
      // Save current user lo localStorage
      window.localStorage.setItem('token', JSON.stringify(authUser));

      const { uid, email } = authUser;

      // Send token to server
      await this.props.firebase.doGetIdToken(uid, email);

      // Save current user
      this.setState({ authUser });

      // Receive router props
      const { location, history } = this.props;

      // If user logged in -> redirect from Login, Register & Reset pwd pages
      const unProtected = [ routes.LOGIN, routes.REGISTER, routes.RESET_PWD ];

      if(unProtected.find(item => item === location.pathname)) history.push(routes.DASHBOARD);
    }

    // ==================>                             <================== //
    //   If user logged out -> clear localStorage & redirect to Home page
    // ==================>                             <================== //

    handleUserLoggedOut = () => {
      // Reset current user
      this.setState({ authUser: null });

      // Clear localStorage
      window.localStorage.clear();

      // Receive router props
      const { location, history } = this.props;

      const protectedR = [
        routes.DASHBOARD, routes.PROFILE,routes.MENU, routes.MENU_ITEM, routes.DISHES, routes.DISH, routes.PRODUCTS, routes.PRODUCT
      ];

      // Redirect to Login page if unsigned
      if (protectedR.find(item => item === location.pathname)) history.push(routes.LOGIN)
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
            <Component {...this.props} authUser={this.state.authUser} />
        </AuthContext.Provider>
      );
    }
  };

  // ==================>                             <================== //
  //                    Apply Firebase & Router props
  // ==================>                             <================== //

  return withRouter(withFirebase(Auth));
};

/* ------------------------------------------------------------------- */
/*                        Provide authUser HOC
/* ------------------------------------------------------------------- */

// =====> currentUser HOC
export const withAuth = Component => props => (
  <AuthContext.Consumer>
    {authUser => <Component {...props} authUser={authUser} />}
  </AuthContext.Consumer>
);





//
