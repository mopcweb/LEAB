import React, { Component } from 'react';

import axios from 'axios';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                               Config
/* ------------------------------------------------------------------- */

// =====> Api
import * as api from '../../config/api';

// =====> Constants
import { products } from '../../config/constants';

// =====> Store
import { withUser } from '../../config/store';

/* ------------------------------------------------------------------- */
/*                            My components
/* ------------------------------------------------------------------- */

import {Wrapper} from '../../components/Main';
import List from '../../components/ListFilter';
import Modal from '../../components/Modal';
import Alert, { showAlert } from '../../components/Alert';
import ListOfItems from '../../components/ListOfItems';
import { capitalize } from '../../components/UsefulF';

/* ------------------------------------------------------------------- */
/*                               Products
/* ------------------------------------------------------------------- */

class Products extends Component {
  constructor(props) {
    super(props);

    // =====> State
    this.state = {
      isOpen: false,
      catTitle: '',
      catImg: '',
      catImgTitle: products.catImgTitle,
      categories: [],
      products: [],
      alert: {
        show: false,
        value: '',
        class: '',
      }
    };

    // =====> Config input field for category in Modal
    this.inputs = [
      {
        type: 'text',
        id: 'catTitle',
        placeholder: products.catTitle,
        onChange: this.handleCatTitleChange.bind(this),
      }
    ];

    // =====> Bind showAlert method
    this.showAlert = showAlert.bind(this);
  };

  // ==================>                             <================== //
  //                  Handle open/close Modal component
  // ==================>                             <================== //

  handleOpenModal = (e) => {
    // Close onClick at btn or out of modal inner
    if (e.target.closest('.Modal-Close') || !e.target.closest('.Modal-Inner'))
    this.setState(state => ({isOpen: !state.isOpen}))
  }

  // ==================>                             <================== //
  //                     Handle click on add button
  // ==================>                             <================== //

  handleAddItem = async (e) => {
    // Prevent default page reload
    e.preventDefault();

    // Receive data from State
    const { catTitle, catImg } = this.state;

    // Stop running & show error message if there is no text
    if (this.state.catTitle === '') {
      clearTimeout(this.timer);
      return this.timer = this.showAlert(products.addEmptyCatTitleMsg, 'Message_error');
    };

    // Save & send new category
    await axios
      .post(api.PRODUCTS_CATEGORIES, { img: catImg, title: capitalize(catTitle) })
      .then(res => {
        // Show success message
        clearTimeout(this.timer);
        this.timer = this.showAlert(products.addCategoryMsg, 'Message_success');

        // Console.log result of request
        console.log('=====> New category', res.data)
      })
      .catch(err => {
        // Show error message
        clearTimeout(this.timer);
        this.timer = this.showAlert(`${products.existMsg}`, 'Message_error');

        // Console.log result of request
        console.log('=====> Error ', err)
      });

    // Reset input value
    this.setState({ catTitle: '', catImg: '', catImgTitle: products.catImgTitle });

    // Request new categories
    await this.getCategories()
  }

  // ==================>                             <================== //
  //                         Handle preview img
  // ==================>                             <================== //

  handlePreviewImg = (e) => {
    // Define file
    const file = e.target.files[0];

    // =====> Error: file type is not image
    if (file && file.type.indexOf('image') === -1) {
      clearTimeout(this.timer);
      return this.timer = this.showAlert(products.onlyImgsMsg, 'Message_error');
    };

    // =====> Error: jile size is more than products.fileSize
    if (file && file.size > products.fileSize) {
      clearTimeout(this.timer);
      return this.timer = this.showAlert(products.fileTooBigMsg, 'Message_error');
    };

    // Change label value of file input
    if (file) this.setState({catImgTitle: file.name});

    // New reader
    const reader = new FileReader();

    // Handle load end event
    reader.onloadend = () => this.setState({catImg: reader.result});

    // Put reader.result into file
    if (file) reader.readAsDataURL(file);
  }

  // ==================>                             <================== //
  //                     Handle click on remove btn
  // ==================>                             <================== //

  handleRemoveItem = async (e) => {
    // Define clicked category: id, label text, value of assotiated input
    this.id = e.target.htmlFor;
    this.rename = e.target.textContent;
    this.inputValue = document.getElementById(this.id).value;

    // Find category title by id
    const { categories } = this.state;
    this.title = capitalize(categories.find(item => item.id === this.id).title);

    // =====> Ask if sure & stop running if not sure
    if (!window.confirm('Are you sure?')) return

    // Check if there any products using this category
    // If they are -> save into array
    this.existProducts = await axios
      .get(api.PRODUCTS, { params: { category: this.title } })
      .then(res => res.data)
      .catch(err => console.log(err));

    console.log(this.existProducts)

    // =====> Error: Can't rename into empty string
    if (this.rename.toLowerCase() === 'rename' && this.inputValue === '') {
      clearTimeout(this.timer);
      return this.timer = this.showAlert(products.renameEmptyCatTitleMsg, 'Message_error');
    };

    // If btn value is 'rename' & input Value !== initial title
    // Then -> PUT request to change category title
    // Also if there are any products in this category
    // Then -> PUT request to change their category title
    if (await this.handleRenameItem()) return;

    // If there are products in category -> decline DELETE
    if (this.existProducts.length > 0) {
      clearTimeout(this.timer);
      return this.timer = this.showAlert(products.notEmptyCategoryMsg, 'Message_error');
    };

    await axios
      .delete(`${api.PRODUCTS_CATEGORIES}/${this.id}`)
      .then(res => {
        // Show success message
        clearTimeout(this.timer);
        this.timer = this.showAlert(products.deleteCategoryMsg, 'Message_success');

        console.log('=====> Category deleted', res.data)
      })
      .catch(err => console.log('=====> Error', err));

    // Request & update categories
    await this.getCategories();
  }

  // ==================>                             <================== //
  //                       Handle rename category
  // ==================>                             <================== //

  handleRenameItem = async () => {
    if (this.rename.toLowerCase() === 'rename' && this.inputValue !== this.title) {
      await axios
        .put(`${api.PRODUCTS_CATEGORIES}/${this.id}`, { title: capitalize(this.inputValue) })
        .then(res => {
          // Show success message
          clearTimeout(this.timer);
          this.timer = this.showAlert(products.updateCategoryMsg, 'Message_success');

          // Console.log result of request
          console.log('=====> Updated category', res.data);
        })
        .catch(err => {
          // Show error message
          clearTimeout(this.timer);
          this.timer = this.showAlert(products.existMsg, 'Message_error');

          // Console.log result of request
          console.log('=====> Error', err)
        });

      // If there are any matching products
      // Then -> PUT new category title into matching products
      if (this.existProducts.length > 0) {
        await this.existProducts.forEach( async item => {

          await axios
            .put(`${api.PRODUCTS}/${item._id}`, { category: capitalize(this.inputValue) })
            .then(res => console.log('=====> updated product\'s category', res.data))
            .catch(err => console.log('=====> Error', err));

        });
      };

      // Request again updated categories and products
      this.getCategories();
      this.getProducts();

      // Return true value -> to stop running DELETE func further
      return true
    };

    // Return false value -> to proceed DELETE func
    return false;
  }

  // ==================>                             <================== //
  //                 Handle catTitle input value changes
  // ==================>                             <================== //

  handleCatTitleChange = (e) => {
    this.setState({catTitle: capitalize(e.target.value)});
  }

  // ==================>                             <================== //
  //            Handle closing alert by clicking on its cross
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
    // Get all categories before first render
    this.getCategories();
    this.getProducts();
  }

  // ==================>                             <================== //
  //                Lifecycle hook (just before destroy)
  // ==================>                             <================== //

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  // ==================>                             <================== //
  //                       Get categories request
  // ==================>                             <================== //

  getCategories = () => {
    return axios
      .get(api.PRODUCTS_CATEGORIES)
      .then(res => {
        const categories = res.data.map(item => ({
          title: item.title,
          img: new Buffer(item.img.data).toString(),
          id: item._id
        }));

        // Default sorting from a -> b
        categories.sort((a, b) => a.title.localeCompare(b.title));

        // Update State
        this.setState({categories})
      })
      .catch(err => console.log('=====> Error', err));
  }

  // ==================>                             <================== //
  //                        Get products request
  // ==================>                             <================== //

  getProducts = () => {
    // Requesting data from server. Header 'data' specifies filename
    return axios
      .get(api.PRODUCTS)
      .then(products => {
        // Default sorting by title
        products.data.sort((a, b) => {
          return a.title.localeCompare(b.title);
        });

        // Update State
        this.setState({products: products.data})
      })
      .catch(err => console.log('=====> Error', err));
  }

  // ==================>                             <================== //
  //                                Render
  // ==================>                             <================== //

  render() {
    return (
      <Wrapper addClass='Products' header={products.header}>
        <List
          onModalOpen={this.handleOpenModal}
          categories={this.state.categories}
          items={this.state.products}
        />
        <Modal isOpen={this.state.isOpen} onClick={this.handleOpenModal}>
          <ListOfItems
            inputs={this.inputs}
            inputsValues={{
              catTitle: this.state.catTitle
            }}
            img={this.state.catImgTitle}
            items={this.state.categories}
            showAlert={this.showAlert}
            onAdd={this.handleAddItem}
            onRemove={this.handleRemoveItem}
            onChange={this.handleCatTitleChange}
            onPreviewImg={this.handlePreviewImg}
          />
          <Alert value={this.state.alert.value} addClass={this.state.alert.class} isShow={this.state.alert.show} onClick={this.handleAlertClose} />
        </Modal>
      </Wrapper>
    )
  };
};

/* ------------------------------------------------------------------- */
/*                   Provide authUser prop & Export
/* ------------------------------------------------------------------- */

export default (withUser(Products))


//
