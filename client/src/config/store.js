import React, { createContext } from 'react';
import { withRouter } from 'react-router-dom';

/* ------------------------------------------------------- */
/*                        Routes
/* ------------------------------------------------------- */

import * as routes from './routes';

/* ------------------------------------------------------- */
/*                        Firebase
/* ------------------------------------------------------- */

// =====> Firebase Context
export const FbContext = createContext(null);

// =====> Firebase HOC
export const withFirebase = Component => props => (
  <FbContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FbContext.Consumer>
);

/* ------------------------------------------------------- */
/*                        AuthUser
/* ------------------------------------------------------- */

// =====> AuthUser Context
export const AuthContext = createContext(null);

// =====> AuthUser HOC
export const withAuth = Component => {
  class WithAuth extends Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null
      };

      this.handleUserLoggedOut = this.handleUserLoggedOut.bind(this);
      this.handleUserLoggedIn = this.handleUserLoggedIn.bind(this);
    }

    // Check if there is user logged in
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        authUser => {
          authUser
            ? this.handleUserLoggedOut(authUser)
            : this.handleUserLoggedIn()
      });
    }

    // =====> If user logged in -> change state & store user into localStorage
    handleUserLoggedOut(authUser) {
      this.setState({ authUser });

      window.localStorage.setItem('token', JSON.stringify(authUser))
    }

    // =====> If user logged in -> clear localStorage & redirect to Home page
    handleUserLoggedIn() {
      this.setState({ authUser: null });

      window.localStorage.clear();

      this.props.history.push(routes.HOME)
    }

    // Remove listener on component destroy
    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthContext.Provider>
      );
    }
  };

  return withRouter(withFirebase(WithAuth));
};

/* ------------------------------------------------------- */
/*                        WithAuthorization
/* ------------------------------------------------------- */

// =====> Checking if there a user authorized. If not -> redirect to Home page
export const withAuthorization = condition => Component => {
  class WithAuthorization extends Component {

    // Check if there is user logged in
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        authUser => {
          if (!condition(authUser)) {
            this.props.history.push(routes.HOME);
          }
        },
      );
    }

    // Remove listener on component destroy
    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthContext.Consumer>
          {authUser =>
            condition(authUser) ? <Component {...this.props} /> : null
          }
        </AuthContext.Consumer>
      )
    }
  };

  return withRouter(withFirebase(WithAuthorization))
};
