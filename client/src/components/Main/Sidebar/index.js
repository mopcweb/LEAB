import React, { Component } from 'react';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              This component
/* ------------------------------------------------------------------- */

export default class Sidebar extends Component {
  render() {
    return (
      <div className='Sidebar'>
        <Some />
        <Some />
        <Some />
      </div>
    )
  };
};

class Some extends Component {
  render() {
    return (
      <div className='Some'>
        <h2>Some awesome widget :)</h2>
      </div>
    )
  };
};
