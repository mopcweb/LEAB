import React, { Component, Fragment } from 'react';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              My components
/* ------------------------------------------------------------------- */

import Nav from './Nav';
import Sidebar from './Sidebar';

/* ------------------------------------------------------------------- */
/*                              Main component
/* ------------------------------------------------------------------- */

export default class Main extends Component {
  render() {
    return (
      <Fragment>
        <Nav />
        <div className='Main'>
          {this.props.children}
          <Sidebar />
        </div>
      </Fragment>
    )
  };
};

export class Wrapper extends Component {
  render () {
    return (
      <div className={this.props.addClass ? this.props.addClass + ' Wrapper' : 'Wrapper'}>
        <div className='Header'>
          {this.props.header}
        </div>
        {this.props.children}
      </div>
    )
  };
};
