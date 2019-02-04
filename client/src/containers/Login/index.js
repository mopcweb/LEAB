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
/*                              Login component
/* ------------------------------------------------------------------- */

export default class Login extends Component {
  render() {
    return (
      <Wrapper addClass='Login'>
        <div className='Login-Header'>
          <Link to={routes.HOME}>
            Home
          </Link>
          <Link to={routes.REGISTER}>
            Register
          </Link>
          <span>
            Sign in
          </span>
        </div>

        <div className='Login-Inner'>
          <h2>Nice to meet you again !</h2>

          <br/><br/>

          <h1>Please, come in and let's eat a bit!</h1>

          <br/><br/>

          <form className='Login-Form'>
            <Input type='email' name='email' label='Your email' />
            <Input type='password' name='password' label='Your password' />

            <Link to={routes.DASHBOARD} className='Login-Btn'>
              Sign in
            </Link>
          </form>

          <div className='Login-Question'>
            Don't have an account yet ? 

            <Link to={routes.REGISTER}>
              Create account
            </Link>
          </div>

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
            ? 'Login-Label Login-Label_active'
            : 'Login-Label'}
        >
          {this.props.label}
        </span>
      </div>
    )
  };
};



//
