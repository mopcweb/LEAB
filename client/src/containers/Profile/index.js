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

// =====> Store
import { withFirebase, withUser } from '../../config/store';

/* ------------------------------------------------------------------- */
/*                            My Components
/* ------------------------------------------------------------------- */

import { Wrapper } from '../../components/Main';
import { Inputs, Select, Submit } from '../../components/FormElems';
import { capitalize } from '../../components/UsefulF';
import Alert, { showAlert } from '../../components/Alert';

/* ------------------------------------------------------------------- */
/*                               Profile
/* ------------------------------------------------------------------- */

class Profile extends Component {
  constructor(props) {
    super(props);

    // =====> State
    this.state = {
      user: '',
      username: '',
      email: '',
      img: profile.defaultImg,
      password: '',
      confirmPassword: '',
      ccal: '',
      proteins: '',
      fats: '',
      carbs: '',
      currencies: [
        { title: 'USD', id: 1 }, { title: 'EUR', id: 2 }, { title: 'UAH', id: 3 }
      ],
      currency: 'USD',
      langs: [{ title: 'en', id: 1 }, { title: 'ru', id: 2 }],
      lang: 'en',
      standart: '',
      big: '',
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
      {
        type: 'number',
        id: 'standart',
        label: profile.standart,
        placeholder: profile.standart,
        onChange: this.handleChange
      },
      {
        type: 'number',
        id: 'big',
        label: profile.big,
        placeholder: profile.big,
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

    // =====> Config for lang select
    this.lang = {
      label: 'Choose lang',
      id: 'lang'
    };
  };

  // ==================>                             <================== //
  //                    Handle inputs values changes
  // ==================>                             <================== //

  handleChange = (e) => {
    const state = e.target.id;

    // Update target input state
    this.setState({[state]: e.target.value});

    if (state === 'username') this.setState({[state]: capitalize(e.target.value)})
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
  //                        Handle submit btn
  // ==================>                             <================== //

  handleSubmit = (e) => {
    // Prevent default page reload
    e.preventDefault();

    // Receive pwd value from state
    const { password } = this.state;

    // Call Firebase Api -> Update pwd
    this.props.firebase
      .doPasswordUpdate(password)
      .then(() => {
        // If success -> reset state
        this.setState({password: '', confirmPassword: ''})

        // And show success msg
        clearTimeout(this.timer);
        this.timer = this.showAlert(profile.pwdUpdateMsg, 'Message_success');
      })
      .catch(err => {
        // Show error msg
        clearTimeout(this.timer);
        this.timer = this.showAlert(err.message, 'Message_error');
      });
  }

  // ==================>                             <================== //
  //                         Handle img preview
  // ==================>                             <================== //

  handlePreviewImg = (e) => {
    // Define file
    const file = e.target.files[0];

    // Show error alert if file type is not image
    if (file && file.type.indexOf('image') === -1) {
      clearTimeout(this.timer);
      return this.timer = this.showAlert(profile.onlyImgsMsg, 'Message_error');
    };

    // Show error alert if jile size more than profile.fileSize
    if (file && file.size > profile.fileSize) {
      clearTimeout(this.timer);
      return this.timer = this.showAlert(profile.fileTooBigMsg, 'Message_error');
    };

    // New reader
    const reader = new FileReader();

    // Handle load end event
    reader.onloadend = () => this.setState({img: reader.result})

    // Put reader.result into file
    if (file) reader.readAsDataURL(file)
    else this.setState({img: profile.defaultImg})
  }

  // ==================>                             <================== //
  //                  Handle save profile config (Edit)
  // ==================>                             <================== //

  handleSave = (e) => {
    // Prevent default page reload
    e.preventDefault();

    // Receive data from state for usage
    const { username, currency, img, standart, big } = this.state;

    // Send data into db
    axios
      .put(api.USERS + '/' + this.state.user._id, {
        username, currency, img, standart, big
       })
      .then(res => {
        // Show success message
        clearTimeout(this.timer);
        this.timer = this.showAlert(profile.profileUpMsg, 'Message_success');
      })
      .catch(err => console.log(err));
  }

  // ==================>                             <================== //
  //                  Lifecycle hook (just before render)
  // ==================>                             <================== //

  componentDidMount() {
    this.getUser()
  }

  // ==================>                             <================== //
  //                  Get current User profile
  // ==================>                             <================== //

  getUser = () => {
    const { email } = this.props.authUser;

    if (!email) return setTimeout(() => this.getUser(), 0);

    // Request current user
    axios
      .get(api.USERS + '/' + email)
      .then(res => this.updateUser(res.data))
      .catch(err => console.log(err));
  }

  // ==================>                             <================== //
  //                  Upadte user state & localStorage
  // ==================>                             <================== //

  updateUser = (user) => {
    // Receive neccesary fields
    const { username, currency, img, standart, big } = user;

    // Update state
    this.setState({
      user, username, currency, img: img ? new Buffer(img) : '', standart, big
    });
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
    // Receive state variables
    const {
      username, user, password, confirmPassword, currency, currencies,
      img, standart, big, ccal, proteins, fats, carbs, alert, lang, langs
    } = this.state;

    // Check validation
    const isInvalid = password !== confirmPassword || password === '';

    // Check if input fileds are unchanged
    const isInvalidEdit =
      username === user.username &&
      currency === user.currency &&
      img === user.img

    return (
      <Fragment>
        <Wrapper
          addClass='Profile'
          header={`${username}'s profile`}
        >
          <User
            inputs={this.user}
            inputsValues={{ password, confirmPassword }}
            img={img}
            username={username}
            isInvalid={isInvalid}
            onSubmit={this.handleSubmit}
            onPreview={this.handlePreviewImg}
           />
          <Form
            inputs={this.config}
            values={{ username, standart, big, ccal, proteins, fats, carbs }}
            title={profile.form2Title}
            isInvalid={isInvalidEdit}
            submit={profile.form2Submit}
            onSubmit={this.handleSave}
          >
            <Select
              config={this.currency}
              value={currency}
              options={currencies}
              onChange={this.handleChange}
            />
            <Select
              config={this.lang}
              value={lang}
              options={langs}
              onChange={this.handleChange}
            />
          </Form>
        </Wrapper>

        <Alert value={alert.value} addClass={alert.class} isShow={alert.show}
          onClick={this.handleAlertClose}
        />
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
export default withFirebase(withUser(Profile));
