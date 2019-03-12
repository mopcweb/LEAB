import React, { Fragment, createContext } from 'react';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              Loader
/* ------------------------------------------------------------------- */

// =====> Loader Context
const ShowLoaderContext = createContext(null);
const HideLoaderContext = createContext(null);

// =====> Provide Loader
export const provideLoader = Component => {
  class Loader extends React.Component {
    constructor(props) {
      super(props);

      // =====> State
      this.state = {
        show: true,
        important: false
      };
    }

    // ==================>                             <================== //
    //                             Show Loader
    // ==================>                             <================== //

    showLoader = (important?) => {
      clearTimeout(this.timer);

      this.setState({ show: true, important });
    }

    // ==================>                             <================== //
    //                             Hide Loader
    // ==================>                             <================== //

    hideLoader = (time?, clear?) => {
      // If important -> stop
      if (this.state.important && !clear) return;

      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.setState({ show: false }), time ? time : 300)
    }

    // ==================>                             <================== //
    //                  Lifecycle hook (just before destroy)
    // ==================>                             <================== //

    componentWillUnmount() {
      clearTimeout(this.timer);
    }

    // ==================>                             <================== //
    //                               Render
    // ==================>                             <================== //

    render() {
      return (
        <ShowLoaderContext.Provider value={this.showLoader}>
          <HideLoaderContext.Provider value={this.hideLoader}>
            <Fragment>
              {this.state.show &&
                <div className='Loader'>
                  <div className='Loader-Spinner'></div>
                </div>
              }
              <Component {...this.props} />
            </Fragment>
          </HideLoaderContext.Provider>
        </ShowLoaderContext.Provider>
      )
    }
  };

  return Loader;
};

// =====> Provide Loader methods
const withLoader = Component => props => (
  <ShowLoaderContext.Consumer>
    {showLoader => (
      <HideLoaderContext.Consumer>
        {hideLoader => (
          <Component {...props} showLoader={showLoader} hideLoader={hideLoader} />
        )}
      </HideLoaderContext.Consumer>
    )}
  </ShowLoaderContext.Consumer>
);

export default withLoader;


//
