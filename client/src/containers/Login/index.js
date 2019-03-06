import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              Routes
/* ------------------------------------------------------------------- */

// =====> Routes
import * as routes from '../../config/routes';

// =====> Firebase
import { withFirebase } from '../../config/store';

/* ------------------------------------------------------------------- */
/*                              My components
/* ------------------------------------------------------------------- */

import { Wrapper } from '../../components/Main';
import withAlert from '../../components/Alert';

/* ------------------------------------------------------------------- */
/*                               Login
/* ------------------------------------------------------------------- */

export default class Login extends Component {
  render() {
    return (
      <Wrapper addClass='Login'>
        <Header />

        <div className='Login-Inner'>
          <h2>Welcome to the LEAB app !</h2>

          <br/><br/>

          <h1>Nice to meet you again. Please come in!</h1>

          <br/><br/>

          <SignIn />

          <div className='Login-Question'>
            Don't have an account yet ?

            <Link to={routes.REGISTER}>
              Create account
            </Link>
          </div>

          <div className='Login-Question'>
            Forgot password ?

            <Link to={routes.RESET_PWD}>
              Reset password
            </Link>
          </div>

        </div>
      </Wrapper>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                               Header
/* ------------------------------------------------------------------- */

class Header extends Component {
  render() {
    return (
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
    )
  };
};

/* ------------------------------------------------------------------- */
/*                               Form
/* ------------------------------------------------------------------- */

class Form extends Component {
  constructor(props) {
    super(props);

    // =====> State
    this.state = {
      email: '',
      password: ''
    };
  }

  // ==================>                             <================== //
  //                     Handle input value change
  // ==================>                             <================== //

  handleChange = (e) => this.setState({[e.target.name]: e.target.value})

  // ==================>                             <================== //
  //                    Handle click on submit button
  // ==================>                             <================== //

  handleSubmit = (e) => {
    // Prevent default page reload
    e.preventDefault();

    // Get necessary variables from state
    const { email, password } = this.state;

    // Get necessary variables from props
    const { firebase, history, showAlert } = this.props;

    firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(authUser => {

        // Set to default empty value
        this.setState({
          email: '',
          password: ''
        });

        // Redirect to dashboard
        history.push(routes.DASHBOARD);
      })
      .catch(err => showAlert(err.message, 'error'));
  }

  // ==================>                             <================== //
  //                               Render
  // ==================>                             <================== //

  render() {
    // Check validation
    const isInvalid = this.state.password === '' || this.state.email === '';

    return (
      <Fragment>
        <form className='Login-Form' onSubmit={this.handleSubmit}>
          <Input
            type='email'
            name='email'
            label='Email'
            value={this.state.email}
            onChange={this.handleChange}
          />
          <Input
            type='password'
            name='password'
            label='Password'
            value={this.state.password}
            onChange={this.handleChange}
          />

          <button className='Login-Btn' disabled={isInvalid}>
            Sign in
          </button>
        </form>
      </Fragment>
    )
  };
};

// =====> Call Form with FbContext & Router
const SignIn = withRouter(withAlert(withFirebase(Form)));

/* ------------------------------------------------------------------- */
/*                               Input
/* ------------------------------------------------------------------- */

class Input extends Component {
  constructor(props) {
    super(props);

    // =====> State
    this.state = {
      isFocused: false
    };
  }

  // ==================>                             <================== //
  //                         Handle focus / blur
  // ==================>                             <================== //

  handleFocus = (e) => this.setState(state => ({isFocused: !state.isFocused}))

  // ==================>                             <================== //
  //                                Render
  // ==================>                             <================== //

  render() {
    return (
      <div onFocus={this.handleFocus} onBlur={this.handleFocus}>
        <input
          type={this.props.type}
          name={this.props.name}
          value={this.props.value}
          onChange={this.props.onChange}
        />
        <span
          className={this.state.isFocused
            ? 'Login-Label Login-Label_active'
            : this.props.value !== ''
            ? 'Login-Label Login-Label_active'
            : 'Login-Label'
          }
        >
          {this.props.label}
        </span>
      </div>
    )
  };
};



//
