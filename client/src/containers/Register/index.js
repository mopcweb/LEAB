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
/*                                HOCs
/* ------------------------------------------------------------------- */

// =====> Provide Firebase
import { withFirebase } from '../../config/store';

// =====> Provide changeLang
import { changeLang } from '../../config/lang';

/* ------------------------------------------------------------------- */
/*                              My components
/* ------------------------------------------------------------------- */

import { Wrapper } from '../../components/Main';
import Alert, { showAlert } from '../../components/Alert';
import { capitalize } from '../../components/UsefulF';

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

  // ==================>                             <================== //
  //             Handle close alert by clicking on its cross
  // ==================>                             <================== //

  handleAlertClose = (e) => {
    clearTimeout(this.timer);

    this.setState({alert: {
      show: false,
      value: '',
      class: ''
    }});
  }

  // ==================>                             <================== //
  //                     Handle Input value change
  // ==================>                             <================== //

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value});

    if (e.target.name === 'username') this.setState({[e.target.name]: capitalize(e.target.value)});
  }

  // ==================>                             <================== //
  //                     Handle click on submit btn
  // ==================>                             <================== //

  handleSubmit = async (e) => {
    // Prevent default page reload
    e.preventDefault();

    const { username, email, password } = this.state;

    // Check if user already exists
    const exist = await axios
      .get(api.USERS + '/' + email)
      .then(user => user.data)
      .catch(err => console.log('=====> Error', err));

    // If exists -> stop running function
    if (exist) {
      clearTimeout(this.timer);
      return this.timer = this.showAlert(register.existMsg, 'Message_error');
    };

    if (password.length < 6) {
      clearTimeout(this.timer);
      return this.timer = this.showAlert(register.weakPwdMsg, 'Message_error');
    };

    // I have to do it before calling Firebase API
    // Because when API called, we'll be redirected out of Register
    // BUT this.setState would be called after that -> error & memory leak
    // Set state to initial empty value
    this.setState({
      username: '', email: '', password: '', confirmPassword: ''
    });

    // Firebase API for creating new User
    const user = await this.props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(res => res)
      .catch(err => {
        clearTimeout(this.timer);
        this.timer = this.showAlert(err.message, 'Message_error');
      });

    // If there is error -> don't save user data into db
    if (!user) return;

    // Send data to the db
    axios
      .post(api.USERS, {
        username, email,
        img: register.defaultImg,
        standart: register.defaultStandart,
        big: register.defaultBig,
        lang: register.lang
      })
      .catch(err => console.log('=====> Error', err));

    // Request default lang for this user
    this.props.changeLang();

    // Redirect to dashboard
    this.props.history.push(routes.DASHBOARD);
  }

  // ==================>                             <================== //
  //                  Lifecycle hook (just before destroy)
  // ==================>                             <================== //

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  // ==================>                             <================== //
  //                               Render
  // ==================>                             <================== //

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

// =====> Call Form with FbContext & Router & changeLang func
const SignUp = withRouter(withFirebase(changeLang(Form)));

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
  //                            Handle focus
  // ==================>                             <================== //

  handleFocus = (e) => {
    this.setState(state => ({isFocused: !state.isFocused}))
  }

  // ==================>                             <================== //
  //                               Render
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
