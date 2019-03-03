import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              Config
/* ------------------------------------------------------------------- */

// =====> Routes
import * as routes from '../../config/routes';

// =====> Firebase
import { withFirebase } from '../../config/store';

/* ------------------------------------------------------------------- */
/*                            My components
/* ------------------------------------------------------------------- */

import { Wrapper } from '../../components/Main';
import Alert, { showAlert } from '../../components/Alert';

/* ------------------------------------------------------------------- */
/*                          ResetPwd component
/* ------------------------------------------------------------------- */

export default class ResetPwd extends Component {
  render() {
    return (
      <Wrapper addClass='ResetPwd'>
        <Header />

        <div className='ResetPwd-Inner'>
          <h2>Welcome to the LEAB app !</h2>

          <br/><br/>

          <h1>Please type in your email to reset password!</h1>

          <br/><br/>

          <SignIn />

          <div className='ResetPwd-Question'>
            Recall password  ?

            <Link to={routes.LOGIN}>
              Sign In
            </Link>
          </div>

        </div>
      </Wrapper>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                                Header
/* ------------------------------------------------------------------- */

class Header extends Component {
  render() {
    return (
      <div className='ResetPwd-Header'>
        <Link to={routes.HOME}>
          Home
        </Link>
        <Link to={routes.LOGIN}>
          Sign In
        </Link>
        <Link to={routes.REGISTER}>
          Register
        </Link>
        <span>
          Reset Password
        </span>
      </div>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                                 Form
/* ------------------------------------------------------------------- */

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      alert: {
        show: false,
        value: '',
        status: '',
      }
    };

    this.showAlert = showAlert.bind(this);
  }

  // ==================>                             <================== //
  //         Handler for closing alert by clicking on its cross
  // ==================>                             <================== //

  handleAlertClose = (e) => {
    clearTimeout(this.timer);

    this.setState({ alert: {
      show: false,
      value: '',
      status: ''
    }});
  }

  // ==================>                             <================== //
  //                     Handle input value change
  // ==================>                             <================== //

  handleChange = (e) => this.setState({[e.target.name]: e.target.value})

  // ==================>                             <================== //
  //                    Handle click on submit button
  // ==================>                             <================== //

  handleSubmit = async (e) => {
    // Prevent default page reload
    e.preventDefault();

    const { email } = this.state;

    await this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({email: ''})
        this.props.history.push(routes.LOGIN)
      })
      .catch(err => {
        clearTimeout(this.timer);
        this.timer = this.showAlert(err.message, 'error');

        return console.log('=====> Error:', {status: 'Error', error: err.message})
      });
  }

  // ==================>                             <================== //
  //                Lifecycle hook (just before destroy)
  // ==================>                             <================== //

  componentWillUnmount() {
    // Clear alert timeout
    clearTimeout(this.timer);
  }

  // ==================>                             <================== //
  //                              Render
  // ==================>                             <================== //

  render() {
    // Check validation
    const isInvalid = this.state.email === '';

    return (
      <Fragment>
        <form className='ResetPwd-Form' onSubmit={this.handleSubmit}>
          <Input
            type='email'
            name='email'
            label='Email'
            value={this.state.email}
            onChange={this.handleChange}
          />

          <button className='ResetPwd-Btn' disabled={isInvalid}>
            Reset password
          </button>
        </form>

        <Alert value={this.state.alert.value} status={this.state.alert.status} show={this.state.alert.show} onClick={this.handleAlertClose} />
      </Fragment>
    )
  };
};

// =====> Call Form with FbContext & Router
const SignIn = withRouter(withFirebase(Form));

/* ------------------------------------------------------------------- */
/*                                Input
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
  //                     Handle focus / blur on input
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
            ? 'ResetPwd-Label ResetPwd-Label_active'
            : this.props.value !== ''
            ? 'ResetPwd-Label ResetPwd-Label_active'
            : 'ResetPwd-Label'
          }
        >
          {this.props.label}
        </span>
      </div>
    )
  };
};



//
