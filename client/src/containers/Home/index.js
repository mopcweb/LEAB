import React, { Component } from 'react';
import { Link } from 'react-router-dom';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              My components
/* ------------------------------------------------------------------- */

import { Wrapper } from '../../components/Main';
// import List from '../../components/ListFilter';
// import Modal from '../../components/Modal';
// import Alert, { showAlert } from '../../components/Alert';
// import ListOfItems from '../../components/ListOfItems';
// import { capitalize } from '../../components/UsefulF';
// import { Products as Config } from '../../components/Config';

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

          <Link to='/dashboard' className='Home-Login'>
            Log in
          </Link>
        </div>
      </Wrapper>
    )
  }
}





//
