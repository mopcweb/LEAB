import React, { Component } from 'react';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              My components
/* ------------------------------------------------------------------- */

/* ------------------------------------------------------------------- */
/*                              Modal component
/* ------------------------------------------------------------------- */

export default class Modal extends Component {
  render() {
    return (
      <div className={this.props.isOpen ? `Modal Modal_open` : `Modal`}>
        <button
          className='Modal-Close'
          onClick={this.props.onClick}
        ></button>
        <div className='Modal-Inner'>
          {this.props.children}
        </div>
      </div>
    )
  };
};
