import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import axios from 'axios';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

import defaultImg from './default.svg';

/* ------------------------------------------------------------------- */
/*                              Config
/* ------------------------------------------------------------------- */

// =====> Api
import * as api from '../../config/api';

// =====> Routes
import * as routes from '../../config/routes';

/* ------------------------------------------------------------------- */
/*                            My Components
/* ------------------------------------------------------------------- */

import { Inputs, Input, Select, SubmitLink } from '../../components/FormElems';
import { Wrapper } from '../../components/Main';
import Alert, { showAlert } from '../../components/Alert';
import { capitalize, makeURL } from '../../components/UsefulF';

/* ------------------------------------------------------------------- */
/*                               Product
/* ------------------------------------------------------------------- */

class Product extends Component {
  constructor(props) {
    super(props);

    // =====> State
    this.state = {
      id: '',
      title: '',
      link: '',
      img: defaultImg,
      price: '',
      categories: [],
      category: '',
      unit: '100 gr (ml)',
      amount: '',
      proteins: '',
      fats: '',
      carbs: '',
      ccal: `0 /  100 gr (ml)`,
      alert: {
        show: false,
        value: '',
        class: '',
      }
    };

    // =====> Bind showAlert method
    this.showAlert = showAlert.bind(this);
  };

  // ==================>                             <================== //
  //                       Handle calorie change
  // ==================>                             <================== //

  handleChangeCcal = (e) => {
    const state = e.target.id;

    // Update target input state
    this.setState({[state]: capitalize(e.target.value)});

    if (state === 'title') this.setState({link: makeURL(e.target.value)})

    // Update ccal state
    this.setState(state => (
      {ccal: (((+state.proteins + +state.carbs) * 4 + +state.fats * 9) + ' / ' + state.unit)}
    ));
  };

  // ==================>                             <================== //
  //                      Handle save/upadate product
  // ==================>                             <================== //

  handleSave = async (e) => {
    // Get state variables
    const { title, link, img, price, proteins,
      fats, carbs, ccal, unit, amount, category, id } = this.state;

    // Create obj with data
    const data = {
      title, link, img, price, ccal, unit, category,
      amount: amount ? amount : 100,
      proteins: proteins ? proteins : 0,
      fats: fats ? fats : 0,
      carbs: carbs ? carbs : 0,
    };

    // Check if all required fields are specified
    if (!title || !price || !category) {
      // Prevent default page reload & redirect
      e.preventDefault();

      // Show error alert
      clearTimeout(this.timer);
      return this.timer = this.showAlert('Title, price & category are required fileds', 'Message_error');
    };

    await axios({
        method: `${id ? 'put' : 'post'}`,
        url: `${api.PRODUCTS}${id ? '/' + id : ''}`,
        data
      })
      .then(res => console.log(`=====> ${id ? 'Updated product' : 'Created product'}`, res))
      .catch(err => console.log('=====> Error', err))

    // Request for this new product -> to receive product id
    this.getProduct();

    // Show success alert
    clearTimeout(this.timer);
    this.timer = this.showAlert(id ? 'Updated' : 'Added new product', 'Message_success');
  }

  // ==================>                             <================== //
  //                       Handle delete product
  // ==================>                             <================== //

  handleDelete = async (e) => {
    // Stop running if there is no saved data
    if (!this.state.id) {
      // Prevent default page reload
      e.preventDefault();

      // Show eror alert
      clearTimeout(this.timer);
      return this.timer = this.showAlert('Nothing to delete', 'Message_error');
    };

    // Ask if sure
    if (!window.confirm('Are you sure?')) return

    // Request
    await axios
      .delete(`${api.PRODUCTS}/${this.state.id}`)
      .then(res => console.log('=====> Deleted', res.data))
      .catch(err => console.log('=====> Error', err))
  }

  // ==================>                             <================== //
  //                         Handle preview img
  // ==================>                             <================== //

  handlePreviewImg = (e) => {
    // Define file
    const file = e.target.files[0];

    // Show error alert if file type is not image
    if (file && file.type.indexOf('image') === -1) {
      clearTimeout(this.timer);
      return this.timer = this.showAlert('Only images allowed', 'Message_error');
    };

    // Show error alert if jile size more than 1000kb (1000000bytes)
    if (file && file.size > 1000000) {
      clearTimeout(this.timer);
      return this.timer = this.showAlert('File too big. Max size is 100 kb', 'Message_error');
    };

    // New reader
    const reader = new FileReader();

    // Handle load end event
    reader.onloadend = () => this.setState({img: reader.result})

    // Put reader.result into file
    file ? reader.readAsDataURL(file) : this.setState({img: defaultImg})
  }

  // ==================>                             <================== //
  //            Handle close alert by clicking on its cross
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
  //                 Lifecycle hook (just before render)
  // ==================>                             <================== //

  componentDidMount() {
    this.getCategories();
    this.getProduct();
  }

  // ==================>                             <================== //
  //                Lifecycle hook (just before destroy)
  // ==================>                             <================== //

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  // ==================>                             <================== //
  //                         Get data categories
  // ==================>                             <================== //

  getCategories() {
    return axios
      .get(api.PRODUCTS_CATEGORIES)
      .then(res => {
        // Map all categories to leave only useful fields
        const categories = res.data.map(item => ({ title: item.title, id: item._id }));

        // Default sorting from a -> b
        categories.sort((a, b) => a.title.localeCompare(b.title));

        // Console.log for debug
        console.log(`=====> Categories`, categories);

        // Update State
        this.setState({
          categories, category: categories.length ? categories[0].title : 'No categories'
        });
      })
      .catch(err => console.log('=====> Error', err));
  }

  // ==================>                             <================== //
  //                     Get product by title (link)
  // ==================>                             <================== //

  async getProduct() {
    // Get router props
    const { match, history } = this.props;

    // In purpose to get first field (field could be changed in future)
    const field = Object.keys(match.params)[0];

    // Define current product link
    const prodLink = match.params[field];

    // Try to get existing product
    const product = await axios
      .get(`${api.PRODUCTS}/${prodLink}`)
      .then(res => res.data)
      .catch(err => console.log('=====> Error', err));

    // Redirect if not found page
    if (!product) {
      // If it equals 'new-item' (which is default for new item) -> just stop
      // Else -> redirect to Not Found
      return (prodLink === 'new-item') ? null : history.push(routes.NOT_FOUND)
    };

    // Console log for debug
    console.log('=====> Product', product)

    // Get product variables
    const {
      title, link, _id, img, amount, price, proteins,
      fats, carbs, ccal, unit, category
     } = product;

    // Update state
    this.setState({
      title, link, id: _id, amount, price, proteins, fats, carbs, ccal, unit, category,
      img: new Buffer(img.data).toString()
    });
  }

  // ==================>                             <================== //
  //                               Render
  // ==================>                             <================== //

  render() {
    return (
      <Wrapper addClass='Product'
        header={this.state.title ? this.state.title + '\'s page' : 'Awesome new product\'s page'}>

        <div className='Product-Info'>
          <h2>{this.state.title ? this.state.title : 'Awesome new product'}</h2>

          <form className='Form'>
            <Img src={this.state.img} alt={this.state.title} onPreviewImg={this.handlePreviewImg} />
            <Data
              title={this.state.title}
              link={this.state.link}
              ccal={this.state.ccal}
              amount={this.state.amount}
              inputsValues={{
                'title': this.state.title,
                'price': this.state.price,
                'proteins': this.state.proteins,
                'fats': this.state.fats,
                'carbs': this.state.carbs,
              }}
              unit={this.state.unit}
              category={this.state.category}
              categoriesOptions={this.state.categories}
              onChange={this.handleChangeCcal}
              onSave={this.handleSave}
              onDelete={this.handleDelete}
            />
          </form>
        </div>

        <UsedIn />
        <Alert value={this.state.alert.value} addClass={this.state.alert.class}
        isShow={this.state.alert.show} onClick={this.handleAlertClose} />
      </Wrapper>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                               Img
/* ------------------------------------------------------------------- */

class Img extends Component {
  render() {
    return (
      <div className='Product-Img'>
        <img src={this.props.src} alt={this.props.alt} />
        <label htmlFor='uploadImg'>Upload</label>
        <input type='file' id='uploadImg' onChange={this.props.onPreviewImg} />
      </div>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                               Data
/* ------------------------------------------------------------------- */

class Data extends Component {
  constructor(props) {
    super(props);

    // =====> Config for categories select
    this.categoriesSelect =  {
      label: 'Choose category',
      id: 'category'
    }

    // =====> Config for units select
    this.unitsSelect = {
      label: 'Choose unit of measure',
      id: 'unit'
    }

    // =====> Config for units options
    this.units = [
      { title: '1 peace', id: '1' }, { title: '100 gr (ml)', id: '2' }
    ];

    // =====> Config for inputs
    this.inputs = [
      {
        type: 'text',
        id: 'title',
        label: 'Enter title',
        placeholder: 'Enter title',
      },
      {
        type: 'number',
        id: 'price',
        label: 'Enter price',
        placeholder: 'Enter price',
      },
      {
        type: 'number',
        id: 'proteins',
        label: 'Enter proteins',
        placeholder: 'Enter proteins',
      },
      {
        type: 'number',
        id: 'fats',
        label: 'Enter fats',
        placeholder: 'Enter fats',
      },
      {
        type: 'number',
        id: 'carbs',
        label: 'Enter carbohydrates',
        placeholder: 'Enter carbohydrates',
      }
    ];
  }

  render() {
    // Get this.props variables
    const { inputsValues, onChange, unit, category, categoriesOptions,
      ccal, onDelete, amount, onSave, link } = this.props;

    return (
      <div className='Product-Data'>
        <Inputs data={this.inputs} values={inputsValues}
        onChange={onChange} />

        <Select config={this.unitsSelect} value={unit}
        options={this.units} onChange={onChange} />

        {unit === '1 peace'
          ? <Input type='number' id='amount' label='Enter amount (grams or mlitres)' value={amount}
            onChange={onChange} />
          : null
        }

        <Select config={this.categoriesSelect} value={category}
        options={categoriesOptions} onChange={onChange} />

        <Input type='text' id='ccal' label='Calories' value={ccal} disabled />

        <div className='Form-Rows'>
          <SubmitLink link={routes.PRODUCTS} value='Delete' onClick={onDelete} />
          <SubmitLink link={`${routes.PRODUCTS}/${link}`} value='Save' onClick={onSave} />
        </div>
      </div>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                               UsedIn
/* ------------------------------------------------------------------- */

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

/* ------------------------------------------------------------------- */
/*                               UsedItem
/* ------------------------------------------------------------------- */

class UsedItem extends Component {
  render() {
    return (
      <div className='Product-UsedItem'>
          <Link to={routes.PRODUCTS}>
            <img
              src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRFOzXKKN5s02_uS176v5R3MqKH8UTxTD-G1hgdy0MNNehyK74' alt='123' />
          </Link>
          <div>
            <Link to={routes.PRODUCTS}>
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

/* ------------------------------------------------------------------- */
/*                   Provide router props & Export
/* ------------------------------------------------------------------- */

export default withRouter(Product)


//
