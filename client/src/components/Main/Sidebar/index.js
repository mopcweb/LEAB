import React, { Component } from 'react';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              Config
/* ------------------------------------------------------------------- */

// =====> Provide Lang
import { withLang } from '../../../config/lang';

/* ------------------------------------------------------------------- */
/*                               Sidebar
/* ------------------------------------------------------------------- */

class Sidebar extends Component {
  render() {
    return (
      <div className='Sidebar'>
        <Some lang={this.props.lang.constants.sidebar} />
        <Some lang={this.props.lang.constants.sidebar} />
        <Some lang={this.props.lang.constants.sidebar} />
      </div>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                               Some
/* ------------------------------------------------------------------- */

class Some extends Component {
  render() {
    return (
      <div className='Some'>
        <h2>{this.props.lang.widget1Title}</h2>
      </div>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                              Export
/* ------------------------------------------------------------------- */

export default withLang(Sidebar)
