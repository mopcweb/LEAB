import React, { Component, Fragment } from 'react';

import axios from 'axios';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                                Config
/* ------------------------------------------------------------------- */

// =====> Api
import * as api from '../../config/api';

// =====> Constants
import { profile } from '../../config/constants';

/* ------------------------------------------------------------------- */
/*                            My Components
/* ------------------------------------------------------------------- */

import { Wrapper } from '../../components/Main';
import { Inputs, Select, Submit } from '../../components/FormElems';
import { capitalize } from '../../components/UsefulF';
import Alert, { showAlert } from '../../components/Alert';

import { withFirebase } from '../../config/store';

/* ------------------------------------------------------------------- */
/*                               Profile
/* ------------------------------------------------------------------- */

class Profile extends Component {
  constructor(props) {
    super(props);

    // =====> State
    this.state = {
      user: profile.user ? profile.user : '',
      username: '',
      email: '',
      img: profile.defaultImg,
      password: '',
      confirmPassword: '',
      ccal: '',
      proteins: '',
      fats: '',
      carbs: '',
      currencies: [{title: 'USD', id: '1'}, {title: 'EUR', id: '2'}, {title: 'UAH', id: '3'}],
      currency: 'USD',
      alert: {
        show: false,
        value: '',
        class: '',
      }
    };

    // =====> Bind all methods
    this.showAlert = showAlert.bind(this);

    // =====> Config for inputs of User Edit section
    this.user = [
      {
        type: 'password',
        id: 'password',
        label: profile.pwd,
        placeholder: profile.pwd,
        onChange: this.handleChange
      },
      {
        type: 'password',
        id: 'confirmPassword',
        label: profile.confirmPwd,
        placeholder: profile.confirmPwd,
        onChange: this.handleChange
      }
    ];

    // =====> Config for inputs of config section
    this.config = [
      {
        type: 'text',
        id: 'username',
        label: profile.username,
        placeholder: profile.username,
        onChange: this.handleChange
      },
      // {
      //   type: 'text',
      //   id: 'ccal',
      //   label: 'Calories target per day',
      //   placeholder: 'Calories target per day',
      //   onChange: this.handleChange
      // },
      // {
      //   type: 'text',
      //   id: 'proteins',
      //   label: 'Proteins target per day',
      //   placeholder: 'Proteins target per day',
      //   onChange: this.handleChange
      // },
      // {
      //   type: 'text',
      //   id: 'fats',
      //   label: 'Fats target per day',
      //   placeholder: 'Fats target per day',
      //   onChange: this.handleChange
      // },
      // {
      //   type: 'text',
      //   id: 'carbs',
      //   label: 'Carbohydrates target per day',
      //   placeholder: 'Carbohydrates target per day',
      //   onChange: this.handleChange
      // }
    ];

    // =====> Config for currency select
    this.currency = {
      label: profile.currency,
      id: 'currency'
    };
  };

  // =====> Handle inputs values changes
  handleChange = (e) => {
    const state = e.target.id;

    // Update target input state
    this.setState({[state]: e.target.value});

    if (state === 'username') this.setState({[state]: capitalize(e.target.value)})
  }

  // =====> Handle close alert by clicking on its cross
  handleAlertClose = (e) => {
    clearTimeout(this.timer);

    this.setState({alert: {
      show: false,
      value: '',
      class: ''
    }});
  }

  // =====> Handle submit btn
  handleSubmit = (e) => {
    // Prevent default page reload
    e.preventDefault();

    const { password } = this.state;

    this.props.firebase
      .doPasswordUpdate(password)
      .then(() => {
        this.setState({password: '', confirmPassword: ''})

        clearTimeout(this.timer);
        this.timer = this.showAlert(profile.pwdUpdateMsg, 'Message_success');
      })
      .catch(err => {
        clearTimeout(this.timer);
        this.timer = this.showAlert(err.message, 'Message_error');

        // =====> For debug only
        return console.log('=====> Error:', {status: 'Error', error: err.message})
      });
  }

  // =====> Handle img preview
  handlePreviewImg = (e) => {
    // Define file
    const file = e.target.files[0];

    // Show error alert if file type is not image
    if (file && file.type.indexOf('image') === -1) {
      clearTimeout(this.timer);
      this.timer = this.showAlert(profile.onlyImgsMsg, 'Message_error');

      return
    };

    // Show error alert if jile size more than profile.fileSize
    if (file && file.size > profile.fileSize) {
      clearTimeout(this.timer);
      this.timer = this.showAlert(profile.fileTooBigMsg, 'Message_error');

      return
    };

    // New reader
    const reader = new FileReader();

    // Handle load end event
    reader.onloadend = () => this.setState({img: reader.result})

    // Put reader.result into file
    if (file) reader.readAsDataURL(file)
    else this.setState({img: profile.defaultImg})
  }

  // =====> Handle save profile config (Edit)
  handleSave = (e) => {
    // Prevent default page reload
    e.preventDefault();

    // Receive data from state for usage
    const { username, currency, img } = this.state;

    // Send data into db
    axios
      .put(api.USERS + '/' + this.state.user._id, { username, currency, img })
      .then(res => {
        // Show success message
        clearTimeout(this.timer);
        this.timer = this.showAlert(profile.profileUpMsg, 'Message_success');
      })
      .catch(err => console.log(err));
  }

  // =====> update state just after before component render
  componentDidMount() {
    this.getUser()
  }

  // =====> Get current User profile
  getUser = () => {
    // Get token from localStorage
    const token = JSON.parse(window.localStorage.getItem(profile.tokenLC));

    // Receive email into variable
    const email = token ? token.email : '';

    // If there is no email (if user manually clear storage) -> recursice call of getUser()
    if (!email) return setTimeout(() => this.getUser(), 0)

    // Request current user
    axios
      .get(api.USERS + '/' + email)
      .then(res => this.updateUser(res.data))
      .catch(err => console.log(err));
  }

  // =====> Upadte user state & localStorage
  updateUser = (user) => {
    // Put user into localStorage
    window.localStorage.setItem(profile.userLC, JSON.stringify(user));

    // Receive neccesary fields
    const { username, currency, img } = user;

    // Update state
    this.setState({ user, username, currency, img: img ? new Buffer(img) : '' });
  }

  // =====> Clear Alert timer before component destroy
  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  // =====> Render
  render() {
    // Check validation
    const isInvalid = this.state.password !== this.state.confirmPassword ||
    this.state.password === '';

    // Check if input fileds are unchanged
    const isInvalidEdit =
      this.state.username === this.state.user.username &&
      this.state.currency === this.state.user.currency &&
      this.state.img === this.state.user.img

    return (
      <Fragment>
        <Wrapper
          addClass='Profile'
          header={`${this.state.username}'s profile`}
        >
          <User
            inputs={this.user}
            inputsValues={{
              password: this.state.password,
              confirmPassword: this.state.confirmPassword
            }}
            img={this.state.img}
            username={this.state.username}
            isInvalid={isInvalid}
            onSubmit={this.handleSubmit}
            onPreview={this.handlePreviewImg}
           />
          <Form
            inputs={this.config}
            values={{
              username: this.state.username,
              ccal: this.state.ccal,
              proteins: this.state.proteins,
              fats: this.state.fats,
              carbs: this.state.carbs
            }}
            title={profile.form2Title}
            isInvalid={isInvalidEdit}
            submit={profile.form2Submit}
            onSubmit={this.handleSave}
          >
            <Select
              config={this.currency}
              value={this.state.currency}
              options={this.state.currencies}
              onChange={this.handleChange}
            />
          </Form>
        </Wrapper>

        <Alert value={this.state.alert.value} addClass={this.state.alert.class} isShow={this.state.alert.show} onClick={this.handleAlertClose} />
      </Fragment>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                           User img & pwd
/* ------------------------------------------------------------------- */

class User extends Component {
  render() {
    return (
      <div className='Profile-User'>
        <Img src={this.props.img} alt={this.props.username} onPreview={this.props.onPreview} />
        <Form
          inputs={this.props.inputs}
          values={this.props.inputsValues}
          title={profile.form1Title}
          submit={profile.form1Submit}
          isInvalid={this.props.isInvalid}
          onSubmit={this.props.onSubmit}
        />
      </div>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                               Img
/* ------------------------------------------------------------------- */

class Img extends Component {
  render() {
    return (
      <div className='Profile-Img'>
        <img src={this.props.src} alt={this.props.username} />
        <form>
          <label htmlFor='upload'>{profile.imgUpload}</label>
          <input type='file' id='upload' onChange={this.props.onPreview} />
        </form>
      </div>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                               From
/* ------------------------------------------------------------------- */

class Form extends Component {
  render() {
    return (
      <div className='Form Profile-Form'>
        <h2>{this.props.title}</h2>
        <form onSubmit={this.props.onSubmit}>
          <Inputs data={this.props.inputs} values={this.props.values} />

          {this.props.children}

          <Submit
            value={this.props.submit}
            disabled={this.props.isInvalid ? this.props.isInvalid : false}
          />
        </form>
      </div>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                  Export with Firebase & Router config
/* ------------------------------------------------------------------- */

// =====> Call Form with FbContext & Router
export default withFirebase(Profile);
