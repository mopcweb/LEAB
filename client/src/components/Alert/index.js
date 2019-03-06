import React, { Fragment, createContext } from 'react';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                            Alert HOC
/* ------------------------------------------------------------------- */

// =====> Alert Contexts
const ShowAlertContext = createContext(null);
const CloseAlertContext = createContext(null);

// =====> Provide Alert component with encapsulated methods
export const provideAlert = Component => {
  class Alert extends React.Component {
    constructor(props) {
      super(props);

      // =====> State
      this.state = {
        alert: {
          show: false,
          value: '',
          status: ''
        },
        important: false
      };
    }

    // ==================>                             <================== //
    //                             Show Alert
    // ==================>                             <================== //

    showAlert = (value, status, time?, important?) => {
      // If now showing important alert -> stop
      if (this.state.important) return;

      // Clear prev timer if it is
      clearTimeout(this.timer);

      // Update state
      this.setState({alert: { show: true, value, status }, important});

      // Hide error alert in 5 seconds
      return this.timer = setTimeout(this.closeAlert, time ? time : 5000);
    }

    // ==================>                             <================== //
    //                             Close Alert
    // ==================>                             <================== //

    closeAlert = () => {
      // Clear timer
      clearTimeout(this.timer)

      // Updare state
      this.setState({alert: { show: false, value: '', status: '' }, important: false})
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
        <ShowAlertContext.Provider value={this.showAlert}>
          <CloseAlertContext.Provider value={this.closeAlert}>
            <Fragment>
              <Component {...this.props} />
              {this.state.alert.show
                ? <div className={`Message Message_${this.state.alert.status}`}>
                    <span className='Message-Close' onClick={this.closeAlert}></span>
                    {this.state.alert.value}
                  </div>
                : null}
            </Fragment>
          </CloseAlertContext.Provider>
        </ShowAlertContext.Provider>
      )
    };
  };

  // ==================>                             <================== //
  //                      Return modified component
  // ==================>                             <================== //

  return Alert;
};

// =====> provide Show & Close Methods of Alert Component
const withAlert = Component => props => (
  <ShowAlertContext.Consumer>
    {showAlert => (
      <CloseAlertContext.Consumer>
        {closeAlert => <Component {...props} showAlert={showAlert} closeAlert={closeAlert} />}
      </CloseAlertContext.Consumer>
    )}
  </ShowAlertContext.Consumer>
);

export default withAlert;


//
