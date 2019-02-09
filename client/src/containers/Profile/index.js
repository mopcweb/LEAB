import React, { Component, Fragment } from 'react';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                            My Components
/* ------------------------------------------------------------------- */

import { Wrapper } from '../../components/Main';
import { Inputs, Select, Submit } from '../../components/FormElems';
import { capitalize } from '../../components/UsefulF';
import Alert, { showAlert } from '../../components/Alert';

import { withFirebase } from '../../config/store';

/* ------------------------------------------------------------------- */
/*                            Example data
/* ------------------------------------------------------------------- */

import img from './user.jpg';

/* ------------------------------------------------------------------- */
/*                               Profile
/* ------------------------------------------------------------------- */

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
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

    this.handleChange = this.handleChange.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showAlert = showAlert.bind(this);

    // Config for inputs of User Edit section
    this.user = [
      {
        type: 'text',
        id: 'username',
        label: 'Username',
        placeholder: 'Username',
        onChange: this.handleChange
      },
      {
        type: 'password',
        id: 'password',
        label: 'New password',
        placeholder: 'New password',
        onChange: this.handleChange
      },
      {
        type: 'password',
        id: 'confirmPassword',
        label: 'Confirm password',
        placeholder: 'Confirm password',
        onChange: this.handleChange
      }
    ];

    // Config for inputs of config section
    this.config = [
      {
        type: 'text',
        id: 'ccal',
        label: 'Calories target per day',
        placeholder: 'Calories target per day',
        onChange: this.handleChange
      },
      {
        type: 'text',
        id: 'proteins',
        label: 'Proteins target per day',
        placeholder: 'Proteins target per day',
        onChange: this.handleChange
      },
      {
        type: 'text',
        id: 'fats',
        label: 'Fats target per day',
        placeholder: 'Fats target per day',
        onChange: this.handleChange
      },
      {
        type: 'text',
        id: 'carbs',
        label: 'Carbohydrates target per day',
        placeholder: 'Carbohydrates target per day',
        onChange: this.handleChange
      }
    ];

    // Config for currency select
    this.currency = {
      label: 'Choose currency',
      id: 'currency'
    };
  };

  // =====> Handle inputs values changes
  handleChange(e) {
    const state = e.target.id;

    // Update target input state
    this.setState({[state]: e.target.value});

    if (state === 'username') this.setState({username: capitalize(e.target.value)})
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

  async handleSubmit(e) {
    // Prevent default page reload
    e.preventDefault();

    const { password } = this.state;

    await this.props.firebase
      .doPasswordUpdate(password)
      .then(() => {
        this.setState({password: '', confirmPassword: ''})

        clearTimeout(this.timer);
        this.timer = this.showAlert('Password update success', 'Message_success');
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
    const isInvalid = this.state.password !== this.state.confirmPassword ||
    this.state.password === '' ||
    this.state.username === '';

    return (
      <Fragment>
        <Wrapper addClass='Profile' header='Profile'>
          <User
            inputs={this.user}
            inputsValues={{
              username: this.state.username,
              password: this.state.password,
              confirmPassword: this.state.confirmPassword
            }}
            isInvalid={isInvalid}
            onSubmit={this.handleSubmit}
           />
          <Form
            inputs={this.config}
            values={{
              ccal: this.state.ccal,
              proteins: this.state.proteins,
              fats: this.state.fats,
              carbs: this.state.carbs
            }}
            title='Edit'
            submit='Save'
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

class User extends Component {
  render() {
    return (
      <div className='Profile-User'>
        <Img />
        <Form
          inputs={this.props.inputs}
          values={this.props.inputsValues}
          title='Edit'
          submit='Save'
          isInvalid={this.props.isInvalid}
          onSubmit={this.props.onSubmit}
        />
      </div>
    )
  };
};

class Img extends Component {
  render() {
    return (
      <div className='Profile-Img'>
        <img src={img} alt='asd' />
        <form>
          <label htmlFor='upload'>Upload</label>
          <input type='file' id='upload' />
        </form>
      </div>
    )
  };
};

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

// Call Form with FbContext & Router
export default withFirebase(Profile);
