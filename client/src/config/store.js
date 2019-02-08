import React, { Component, createContext } from 'react';

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

// =====> AuthUser
export const AuthContext = createContext(null);

// =====> AuthUser HOC
export const withAuth = Component => {
  class withAuth extends Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null
      };
    }

    // Check if there is loged in user
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        authUser => {
          authUser
            ? this.setState({ authUser })
            : this.setState({ authUser: null });
      });
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
  }

  return withFirebase(withAuth);
};
