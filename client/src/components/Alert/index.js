import React, { Component } from 'react';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              Alert component
/* ------------------------------------------------------------------- */

export default class Alert extends Component {
  render() {
    return (
      this.props.show
        ? <div className={`Message Message_${this.props.status}`}>
            <span className='Message-Close' onClick={this.props.onClick}></span>
            {this.props.value}
          </div>
        : null
    )
  };
};

// Show alert with props. Declared as es5 function to prevent lose of context. YOU should bind(this) in components constructor before usage
export function showAlert(value, status, time?) {
  this.setState({alert: {
    show: true,
    value,
    status
  }});

  // Hide error alert in 5 seconds
  return setTimeout(() => {
    this.setState({alert: {
      show: false,
      value: '',
      status: ''
    }})
  }, time ? time : 5000);
};
