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
/*                              Register component
/* ------------------------------------------------------------------- */

export default class Register extends Component {
  render() {
    return (
      <Wrapper addClass='Register'>
        <div className='Register-Header'>
          <Link to={routes.HOME}>
            Home
          </Link>
          <Link to={routes.LOGIN}>
            Sign in
          </Link>
          <span>
            Register
          </span>
        </div>

        <div className='Register-Inner'>
          <h2>Welcome to the LEAB app !</h2>

          <br/><br/>

          <h1>Create your login and password, please!</h1>

          <br/><br/>

          <form className='Register-Form'>
            <Input type='email' name='email' label='Your email' />
            <Input type='password' name='password' label='Your password' />

            <Link to={routes.DASHBOARD} className='Register-Btn'>
              Create account
            </Link>
          </form>

        </div>
      </Wrapper>
    )
  };
};

class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isActive: false
    };

    this.handleFocus = this.handleFocus.bind(this);
  }

  handleFocus(e) {
    this.setState(state => ({isActive: !state.isActive}))
  }

  render() {
    return (
      <div onFocus={this.handleFocus} onBlur={this.handleFocus}>
        <input type={this.props.type} name={this.props.name} />
        <span
          className={this.state.isActive
            ? 'Register-Label Register-Label_active'
            : 'Register-Label'}
        >
          {this.props.label}
        </span>
      </div>
    )
  };
};



//
