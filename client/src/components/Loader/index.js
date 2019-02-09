import React, { Component } from 'react';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                               Loader
/* ------------------------------------------------------------------- */

export default class Loader extends Component {
  render() {
    return (
      <div className='Loader'>
        <div className='Loader-Spinner'></div>
      </div>
    )
  };
};
