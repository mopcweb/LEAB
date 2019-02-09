import React, { Component } from 'react';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                            My Components
/* ------------------------------------------------------------------- */

import { Wrapper } from '../../components/Main';
// import { capitalize } from '../../components/UsefulF';
// import Alert, { showAlert } from '../../components/Alert';

/* ------------------------------------------------------------------- */
/*                               NotFound
/* ------------------------------------------------------------------- */

export default class NotFound extends Component {
  render() {
    return (
      <Wrapper addClass='NotFound' header='NotFound'>
        <div>
          NotFound ;)
        </div>
      </Wrapper>
    )
  };
};
