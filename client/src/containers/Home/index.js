import React, { Component } from 'react';
import { Link } from 'react-router-dom';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import * as routes from '../../config/routes';

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              My components
/* ------------------------------------------------------------------- */

import { Wrapper } from '../../components/Main';

/* ------------------------------------------------------------------- */
/*                              Home component
/* ------------------------------------------------------------------- */

export default class Home extends Component {
  render() {
    return (
      <Wrapper addClass='Home'>
        <div>
          <h2>Welcome !</h2>

          <br/><br/>

          <h1>Let's eat a bit !</h1>

          <br/><br/>

          <Link to={routes.LOGIN} className='Home-Login'>
            Sign in
          </Link>

          <Link to={routes.REGISTER} className='Home-Register'>
            Create account
          </Link>
        </div>
      </Wrapper>
    )
  }
}





//
