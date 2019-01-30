import React, { Component } from 'react';
import { Link } from 'react-router-dom';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

import defaultImg from './default.svg';

/* ------------------------------------------------------------------- */
/*                              My Components
/* ------------------------------------------------------------------- */

import { Input, Disabled, Selects, SubmitLink } from '../../components/FormElems';
import { Wrapper } from '../../components/Main';
import Alert, { showAlert } from '../../components/Alert';
import { capitalize, makeURL, replaceSigns } from '../../components/UsefulF';


/* ------------------------------------------------------------------- */
/*                              Product component
/* ------------------------------------------------------------------- */

export default class Product extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      category: '',
      units: [{title: 'kilo(s)', id: '1'}, {title: 'gram(s)', id: '2'}, {title: 'litr(es)', id: '3'}],
      unit: 'kilo(s)',
      // title: capitalize(window.location.pathname.replace(/\/products\//gi, '')),
      title: '',
      id: '',
      img: defaultImg,
      amount: '',
      price: '',
      proteins: '',
      fats: '',
      carbs: '',
      ccal: `0 /  kilo(s)`,
      alert: {
        show: false,
        value: '',
        class: '',
      }
    };

    // Config for categories select
    this.categoriesSelect = {
      label: 'Choose category',
      id: 'category'
    };

    // Config for units select
    this.unitsSelect = {
      label: 'Choose unit of measure',
      id: 'unit'
    };

    // Config for inputs
    this.inputs = [
      {
        type: 'text',
        id: 'title',
        label: 'Enter title',
        placeholder: 'Enter title',
        value: this.state.title,
      },
      {
        type: 'number',
        id: 'amount',
        label: 'Enter amount',
        placeholder: 'Enter amount',
        value: this.state.amount,
      },
      {
        type: 'number',
        id: 'price',
        label: 'Enter price',
        placeholder: 'Enter price',
        value: this.state.price,
      },
      {
        type: 'number',
        id: 'proteins',
        label: 'Enter proteins',
        placeholder: 'Enter proteins',
        value: this.state.proteins,
      },
      {
        type: 'number',
        id: 'fats',
        label: 'Enter fats',
        placeholder: 'Enter fats',
        value: this.state.fats,
      },
      {
        type: 'number',
        id: 'carbs',
        label: 'Enter carbohydrates',
        placeholder: 'Enter carbohydrates',
        value: this.state.carbs,
      }
    ];

    this.handleChangeCcal = this.handleChangeCcal.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handlePreviewImg = this.handlePreviewImg.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.showAlert = showAlert.bind(this);
  };

  handleChangeCcal(e) {
    const state = e.target.id;

    // Check for ONLY english letters usage
    if (!e.target.value.match(/^[A-Za-z0-9\s()]*$/gi)) {
      // Show error alert
      clearTimeout(this.timer);
      this.timer = this.showAlert('Only english letters are allowed', 'Message_error');

      return
    };

    // Update target input state
    this.setState({[state]: e.target.value});

    // Update ccal state
    this.setState(state => (
      {ccal: (((+state.proteins + +state.carbs) * 4 + +state.fats * 9) + ' / ' + state.amount + ' ' + state.unit)}
    ));
  };

  // Handler for saving / updating product
  async handleSave(e) {
    // Create obj with data
    const data = {
      title: makeURL(this.state.title.toLowerCase()),
      img: this.state.img,
      amount: this.state.amount,
      price: this.state.price,
      proteins: this.state.proteins ? this.state.proteins : 0,
      fats: this.state.fats ? this.state.fats : 0,
      carbs: this.state.carbs ? this.state.carbs : 0,
      ccal: this.state.ccal,
      unit: this.state.unit,
      category: this.state.category
    };

    // Check if all required fields are specified
    if (!data.title || !data.unit || !data.amount || !data.price || !data.category) {
      // Prevent default page reload
      e.preventDefault();

      // Show error alert
      clearTimeout(this.timer);
      this.timer = this.showAlert('All fields must be specified', 'Message_error');

      return
    };

    // Create Blob from data
    const blob = new Blob(
      [JSON.stringify(data)],
      {type: 'application/json'}
    );

    // Options for request. Depending whether there is id -> PUT or POST
    const opts = {
      method: `${this.state.id ? 'PUT' : 'POST'}`,
      body: blob
    };

    // Request
    await fetch(`/products${this.state.id ? '/' + this.state.id : ''}`, opts)
      .then(res => console.log(res))
      .catch(err => console.log(err))

    // Show success alert
    clearTimeout(this.timer);
    this.timer = this.showAlert(this.state.id ? 'Updated' : 'Added new product', 'Message_success');
  }

  async handleDelete(e) {
    // Stop running if there is no saved data
    if (!this.state.id) {
      // Prevent default page reload
      e.preventDefault();

      // Show eror alert
      clearTimeout(this.timer);
      this.timer = this.showAlert('Nothing to delete', 'Message_error');

      return
    };

    // Ask if sure
    const confirm = window.confirm('Are you sure?');

    if (!confirm) return

    // Request
    await fetch(`/products/${this.state.id}`, {method: 'DELETE'})
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  handlePreviewImg(e) {
    // Define file
    const file = e.target.files[0];

    // Show error alert if file type is not image
    if (file.type.indexOf('image') === -1) {
      clearTimeout(this.timer);
      this.timer = this.showAlert('Only images allowed', 'Message_error');

      return
    };

    // Show error alert if jile size more than 1000kb (1000000bytes)
    if (file.size > 1000000) {
      clearTimeout(this.timer);
      this.timer = this.showAlert('File too big. Max size is 100 kb', 'Message_error');

      return
    };

    // New reader
    const reader = new FileReader();

    // Handle load end event
    reader.onloadend = () => this.setState({img: reader.result})

    // Put reader.result into file
    if (file) reader.readAsDataURL(file)
    else this.setState({img: defaultImg})
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

  async componentDidMount() {
    await this.getData('categories', 'category');
    await this.getProduct();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  // Get data (categories, units) from db
  getData(all, current) {
    return fetch(`/${all}`)
      .then(res => res.json())
      .then(data => {
        // Lowercased all data
        // let cats = data.map(item => ({title: item.title.toLowerCase().trim(), id: item._id}));
        let cats = data.map(item => ({title: capitalize(item.title), id: item._id}));

        // Default sorting from a -> b
        cats.sort((a, b) => {
          return a.title.localeCompare(b.title);
        });

        console.log(`=====> ${all}`,cats)

        // Update State
        this.setState({[all]: cats, [current]: cats.length ? cats[0].title : ''})
      })
      .catch(err => console.log(err));
  }

  // Get product by title
  async getProduct() {
    let product;

    await fetch(`${this.state.title}`)
      .then(res => res.json())
      .then(data => product = data)
      .catch(err => console.log(err));

    if (product === undefined) return;

    console.log('=====> product', product)

    this.setState({
      title: product.title,
      id: product._id,
      img: new Buffer(product.img.data).toString(),
      amount: product.amount,
      price: product.price,
      proteins: product.proteins,
      fats: product.fats,
      carbs: product.carbs,
      ccal: product.ccal,
      unit: product.unit,
      category: product.category
    });
  }

  render() {
    return (
      <Wrapper addClass='Product' header={replaceSigns(this.state.title ? capitalize(this.state.title) + '\'s page' : 'Awesome new product\'s page')}>
        <Form
          title={this.state.title}
          ccal={this.state.ccal}
          img={this.state.img}
          inputs={this.inputs}
          inputsValues={{
            'title': replaceSigns(capitalize(this.state.title)),
            'amount': this.state.amount,
            'price': this.state.price,
            'proteins': this.state.proteins,
            'fats': this.state.fats,
            'carbs': this.state.carbs,
          }}
          unit={this.state.unit}
          unitsSelect={this.unitsSelect}
          unitsOptions={this.state.units}
          category={this.state.category}
          categoriesSelect={this.categoriesSelect}
          categoriesOptions={this.state.categories}
          onChange={this.handleChangeCcal}
          onSave={this.handleSave}
          onDelete={this.handleDelete}
          onPreviewImg={this.handlePreviewImg}
        />
        <UsedIn />
        <Alert value={this.state.alert.value} addClass={this.state.alert.class} isShow={this.state.alert.show} onClick={this.handleAlertClose} />
      </Wrapper>
    )
  };
};

class Form extends Component {
  render() {
    return (
      <div className='Product-Info'>
        <h2>{replaceSigns(this.props.title ? capitalize(this.props.title) : 'Awesome new product')}</h2>

        <form className='Form'>
          <Img src={this.props.img} alt={this.props.title} onPreviewImg={this.props.onPreviewImg} />
          <Data
            title={this.props.title}
            ccal={this.props.ccal}
            inputs={this.props.inputs}
            inputsValues={this.props.inputsValues}
            unit={this.props.unit}
            unitsSelect={this.props.unitsSelect}
            unitsOptions={this.props.unitsOptions}
            category={this.props.category}
            categoriesSelect={this.props.categoriesSelect}
            categoriesOptions={this.props.categoriesOptions}
            onChange={this.props.onChange}
            onSave={this.props.onSave}
            onDelete={this.props.onDelete}
          />
        </form>

      </div>
    )
  };
};

class Img extends Component {
  render() {
    return (
      <div className='Product-Img'>
        <img src={this.props.src} alt={replaceSigns(capitalize(this.props.alt))} />
        <label htmlFor='uploadImg'>Upload</label>
        <input type='file' id='uploadImg' onChange={this.props.onPreviewImg} />
      </div>
    )
  };
};

class Data extends Component {
  render() {
    return (
      <div className='Product-Data'>
        <Input data={this.props.inputs} values={this.props.inputsValues} onChange={this.props.onChange} />

        <Selects config={this.props.unitsSelect} value={this.props.unit} options={this.props.unitsOptions} onChange={this.props.onChange} />

        <Selects config={this.props.categoriesSelect} value={this.props.category} options={this.props.categoriesOptions} onChange={this.props.onChange} />

        <Disabled type='text' id='ccal' label='Calories' value={this.props.ccal} />

        <div className='Form-Rows'>
          <SubmitLink link='/products' value='Delete' onClick={this.props.onDelete} />
          <SubmitLink link={makeURL(`/products/${this.props.title.toLowerCase()}`)} value='Save' onClick={this.props.onSave} />
        </div>
      </div>
    )
  };
};

class UsedIn extends Component {
  render() {
    return (
      <div className='Product-UsedIn'>
        <h2> This product is used in such dishes </h2>
        <div className='Product-UsedInHolder'>
          <UsedItem />
          <UsedItem />
          <UsedItem />
          <UsedItem />
          <UsedItem />
        </div>
      </div>
    )
  };
};

class UsedItem extends Component {
  render() {
    return (
      <div className='Product-UsedItem'>
          <Link to='/products'>
            <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRFOzXKKN5s02_uS176v5R3MqKH8UTxTD-G1hgdy0MNNehyK74' alt='123' />
          </Link>
          <div>
            <Link to='/products'>
              <h3>Tomatoes</h3>
            </Link>
            <hr />
            <span>Ccal/P/F/C</span>
            <span>1000/25/45/13</span>
          </div>
      </div>
    )
  };
};
