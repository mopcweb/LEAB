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
import { withUser } from './store.js';

/* ------------------------------------------------------------------- */
/*                         Languages Context
/* ------------------------------------------------------------------- */

// =====> Contexts For Lang
const LangContext = createContext(null);
const ChangeLangContext = createContext(null);

/* ------------------------------------------------------------------- */
/*                       Provide Language Context
/* ------------------------------------------------------------------- */

export const provideLang = Component => {
  class ProvideLang extends Component {
    constructor(props) {
      super(props);

      this.state = {
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
        .then(res => this.lang = res.data.lang)
        .catch(err => console.log(err.response));

      // Get data for this lang
      await axios
        .get(api.LANGS + '/' + this.lang)
        .then(res => this.setState({ lang: res.data }))
        .catch(err => console.log(err.response));
    }

    // ==================>                             <================== //
    //     Here we look for authUser received & do first lang download
    // ==================>                             <================== //

    componentDidUpdate(prevProps, prevState) {
      if (prevProps.authUser !== this.props.authUser) {
        this.changeLang()
      };
    }

    // ==================>                             <================== //
    //                  Lifecycle hook (just before destroy)
    // ==================>                             <================== //

    componentWillUnmount() {
      this.changeLang = null
    }

    // ==================>                             <================== //
    //                               Render
    // ==================>                             <================== //

    render() {
      return (
        <LangContext.Provider value={this.state.lang}>
          <ChangeLangContext.Provider value={this.changeLang}>
            {this.state.lang
              ? <Component {...this.props} />
              : this.props.authUser
                ? <Loader />
                : <Component {...this.props} />
            }
          </ChangeLangContext.Provider>
        </LangContext.Provider>
      )
    }
  };

  // ==================>                             <================== //
  //                          Apply authUser
  // ==================>                             <================== //

  return withUser(ProvideLang)
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

export const changeLang = Component => props => (
  <ChangeLangContext.Consumer>
    {changeLang => <Component {...props} changeLang={changeLang} />}
  </ChangeLangContext.Consumer>
);







//
