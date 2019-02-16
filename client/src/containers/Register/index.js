import React, { Component, Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';

import axios from 'axios';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              Config
/* ------------------------------------------------------------------- */

// =====> Routes
import * as routes from '../../config/routes';

// =====> Api
import * as api from '../../config/api';

// =====> Constants
import { register } from '../../config/constants';

/* ------------------------------------------------------------------- */
/*                              My components
/* ------------------------------------------------------------------- */

import { Wrapper } from '../../components/Main';
import Alert, { showAlert } from '../../components/Alert';
import { capitalize } from '../../components/UsefulF';

import { withFirebase } from '../../config/store';

/* ------------------------------------------------------------------- */
/*                               Register
/* ------------------------------------------------------------------- */

export default class Register extends Component {
  render() {
    return (
      <Wrapper addClass='Register'>
        <Header />

        <div className='Register-Inner'>
          <h2>{register.welcome}</h2>

          <br/><br/>

          <h1>{register.tip}</h1>

          <br/><br/>

          <SignUp />

          <div className='Register-Question'>
            {register.question}

            <Link to={routes.LOGIN}>
              {register.questionBtn}
            </Link>
          </div>

        </div>
      </Wrapper>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                              Header
/* ------------------------------------------------------------------- */

class Header extends Component {
  render() {
    const links = register.links.map((item, i) => (
      <Link to={item.link} key={item.value + i}>
        {item.value}
      </Link>
    ));

    return (
      <div className='Register-Header'>
        {links}
        <span>
          {register.activePage}
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

    // =====> Bind showAlert method
    this.showAlert = showAlert.bind(this);
  }

  // =====> Handler for closing alert by clicking on its cross
  handleAlertClose = (e) => {
    clearTimeout(this.timer);

    this.setState({alert: {
      show: false,
      value: '',
      class: ''
    }});
  }

  // =====> Handle Input value change
  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value});

    if (e.target.name === 'username') this.setState({[e.target.name]: capitalize(e.target.value)});
  }

  // =====> Handle click on submit btn
  handleSubmit = async (e) => {
    // Prevent default page reload
    e.preventDefault();

    const { username, email, password } = this.state;

    // Check if user already exists
    const exist = await axios
      .get(api.USERS + '/' + username)
      .then(user => user.data)
      .catch(err => console.log(err));

    // If exists -> stop running function
    if (exist) {
      clearTimeout(this.timer);
      return this.timer = this.showAlert(register.existMsg, 'Message_error');
    };

    // Firebase API for creating new User
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(async authUser => {

        // Send data to the db
        await axios
          .post(api.USERS, {username, email, img: register.defaultImg})
          .then(user => window.localStorage.setItem(register.userLC, JSON.stringify(user.data)))
          .catch(err => console.log(err));

        // Set state to initial empty value
        this.setState({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        });

        // Redirect to dashboard
        this.props.history.push(routes.DASHBOARD);
      })
      .catch(err => {
        clearTimeout(this.timer);
        this.timer = this.showAlert(err.message, 'Message_error');
      });
  }

  // =====> Clear Alert timeout on component destroy
  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  // =====> Render
  render() {
    // Check validation
    const isInvalid =
      this.state.password !== this.state.confirmPassword ||
      this.state.password === '' ||
      this.state.email === '' ||
      this.state.username === '';

    return (
      <Fragment>
        <form className='Register-Form' onSubmit={this.handleSubmit}>
          <Input
            type='text'
            name='username'
            label={register.username}
            value={this.state.username}
            onChange={this.handleChange}
          />
          <Input
            type='email'
            name='email'
            label={register.email}
            value={this.state.email}
            onChange={this.handleChange}
          />
          <Input
            type='password'
            name='password'
            label={register.pwd}
            value={this.state.password}
            onChange={this.handleChange}
          />
          <Input
            type='password'
            name='confirmPassword'
            label={register.confirmPwd}
            value={this.state.confirmPassword}
            onChange={this.handleChange}
          />

          <button className='Register-Btn' disabled={isInvalid}>
            {register.submit}
          </button>
        </form>

        <Alert
          value={this.state.alert.value}
          addClass={this.state.alert.class}
          isShow={this.state.alert.show}
          onClick={this.handleAlertClose}
        />
      </Fragment>
    )
  };
};

// =====> Call Form with FbContext & Router
const SignUp = withRouter(withFirebase(Form));

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

  // =====> Handle focus
  handleFocus = (e) => {
    this.setState(state => ({isFocused: !state.isFocused}))
  }

  // =====> Render
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
            ? 'Register-Label Register-Label_active'
            : this.props.value !== ''
            ? 'Register-Label Register-Label_active'
            : 'Register-Label'
          }
        >
          {this.props.label}
        </span>
      </div>
    )
  };
};



//
