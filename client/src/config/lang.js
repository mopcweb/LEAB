import React, { createContext } from 'react';

import axios from 'axios';

/* ------------------------------------------------------------------- */
/*                              Config
/* ------------------------------------------------------------------- */

// =====> API
import * as api from './api';

/* ------------------------------------------------------------------- */
/*                            Components
/* ------------------------------------------------------------------- */

// =====> Loader
import Loader from '../components/Loader';

// =====> With User
import { withAuth } from './store.js';

/* ------------------------------------------------------------------- */
/*                         Languages Context
/* ------------------------------------------------------------------- */

// =====> Contexts For Lang
const LangContext = createContext(null);
const ChangeLangContext = createContext(null);

// =====> Context For User Profile
const UserContext = createContext(null);

/* ------------------------------------------------------------------- */
/*                       Provide Language Context
/* ------------------------------------------------------------------- */

export const provideLang = Component => {
  class ProvideLang extends Component {
    constructor(props) {
      super(props);

      this.state = {
        user: '',
        lang: ''
      };
    }

    // ==================>                             <================== //
    //           ChangeLang Handler which is passed into profile
    // ==================>                             <================== //

    changeLang = async () => {
      // Stop running is there is no authUser
      if (!this.props.authUser) return;

      // Get email variable from authUser
      const { email } = this.props.authUser;

      // Get current user lang
      await axios
        .get(api.USERS + '/' + email)
        .then(res => {
          this.setState({ user: res.data });
          this.lang = res.data.lang;
        })
        .catch(err => err);

      // Stop if there is no lang
      if (!this.lang) return;

      // Get data for this lang
      await axios
        .get(api.LANGS + '/' + this.lang)
        .then(res => this.setState({ lang: res.data }))
        .catch(err => err);
    }

    // ==================>                             <================== //
    //                  Lifecycle hook (just after render)
    // ==================>                             <================== //

    componentDidMount() {
      this.changeLang();
    }

    // ==================>                             <================== //
    //     Here we look for authUser received & do first lang download
    // ==================>                             <================== //

    componentDidUpdate(prevProps, prevState) {
      if (prevProps.authUser !== this.props.authUser) {
        this.changeLang();
      };
    }

    // ==================>                             <================== //
    //                  Lifecycle hook (just before destroy)
    // ==================>                             <================== //

    componentWillUnmount() {
      this.changeLang = null;
      this.setState({ user: '', lang: '' });
    }

    // ==================>                             <================== //
    //                               Render
    // ==================>                             <================== //

    render() {
      // Get variables from state & props
      const { user, lang } = this.state;
      const { authUser } = this.props;

      return (
        <LangContext.Provider value={this.state.lang}>
          <ChangeLangContext.Provider value={this.changeLang}>
            <UserContext.Provider value={this.state.user}>
              {!!authUser && !!lang && !!user
                ? <Component {...this.props} />
                : !!authUser && (!lang || !user)
                  ? <Loader />
                  : <Component {...this.props} />
              }
            </UserContext.Provider>
          </ChangeLangContext.Provider>
        </LangContext.Provider>
      )
    }
  };

  // ==================>                             <================== //
  //                          Apply authUser
  // ==================>                             <================== //

  return withAuth(ProvideLang)
};

/* ------------------------------------------------------------------- */
/*                      Provide lang to Component
/* ------------------------------------------------------------------- */

export const withLang = Component => props => (
  <LangContext.Consumer>
    {lang => <Component {...props} lang={lang} />}
  </LangContext.Consumer>
);

/* ------------------------------------------------------------------- */
/*               Provide changeLang handler to Component
/* ------------------------------------------------------------------- */

export const withChangeLang = Component => props => (
  <ChangeLangContext.Consumer>
    {changeLang => <Component {...props} changeLang={changeLang} />}
  </ChangeLangContext.Consumer>
);

/* ------------------------------------------------------------------- */
/*                  Provide User Profile to Component
/* ------------------------------------------------------------------- */

export const withUser = Component => props => (
  <UserContext.Consumer>
    {profile => <Component {...props} userProfile={profile} />}
  </UserContext.Consumer>
);





//
