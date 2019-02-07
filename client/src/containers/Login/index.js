import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              Routes
/* ------------------------------------------------------------------- */

import * as routes from '../../config/routes';

/* ------------------------------------------------------------------- */
/*                              My components
/* ------------------------------------------------------------------- */

import { Wrapper } from '../../components/Main';
import Alert, { showAlert } from '../../components/Alert';

import { withFirebase } from '../../config/store';

/* ------------------------------------------------------------------- */
/*                              Login component
/* ------------------------------------------------------------------- */

export default class Login extends Component {
  render() {
    return (
      <Wrapper addClass='Login'>
        <Header />

        <div className='Login-Inner'>
          <h2>Welcome to the LEAB app !</h2>

          <br/><br/>

          <h1>Create your login and password, please!</h1>

          <br/><br/>

          <SignUp />

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

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      alert: {
        show: false,
        value: '',
        class: '',
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.showAlert = showAlert.bind(this);
  }

  // Handler for closing alert by clicking on its cross
  handleAlertClose(e) {
    clearTimeout(this.timer);

    this.setState({alert: {
      show: false,
      value: '',
      class: ''
    }});
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  async handleSubmit(e) {
    // Prevent default page reload
    e.preventDefault();

    const { email, password } = this.state;

    await this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(authUser => {
        this.setState({
          email: '',
          password: ''
        });
        this.props.history.push(routes.DASHBOARD);
      })
      .catch(err => {
        clearTimeout(this.timer);
        this.timer = this.showAlert(err.message, 'Message_error');

        return console.log('=====> Error:', {status: 'Error', error: err.message})
      });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    // Check validation
    const isInvalid =
      this.state.password === '' ||
      this.state.email === '';

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
        {/* {this.state.error && <span>{this.state.error.message}</span>} */}
        <Alert value={this.state.alert.value} addClass={this.state.alert.class} isShow={this.state.alert.show} onClick={this.handleAlertClose} />
      </Fragment>
    )
  };
};

// Call Form with FbContext & Router
const SignUp = withRouter(withFirebase(Form));

class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false
    };

    this.handleFocus = this.handleFocus.bind(this);
  }

  handleFocus(e) {
    this.setState(state => ({isFocused: !state.isFocused}))
  }

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