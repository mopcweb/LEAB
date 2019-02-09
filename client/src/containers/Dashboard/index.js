import React, { Component } from 'react';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              My Components
/* ------------------------------------------------------------------- */

import {Wrapper} from '../../components/Main';

/* ------------------------------------------------------------------- */
/*                              Example data
/* ------------------------------------------------------------------- */


/* ------------------------------------------------------------------- */
/*                              Dashboard component
/* ------------------------------------------------------------------- */

export default class Dashboard extends Component {
  render() {
    return (
      <Wrapper addClass='Dashboard' header='Dashboard'>
        Dashboard
      </Wrapper>
    )
  }
}

// class Diagrams extends Component {
//   render() {
//     return (
//       <div className='Diargams'>
//
//       </div>
//     )
//   };
// };
