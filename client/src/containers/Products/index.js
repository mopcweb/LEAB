import React, { Component } from 'react';

/* ------------------------------------------------------------------- */
/*                              Styles
/* ------------------------------------------------------------------- */

import './index.sass';

/* ------------------------------------------------------------------- */
/*                              My components
/* ------------------------------------------------------------------- */

import {Wrapper} from '../../components/Main';
import List from '../../components/ListFilter';
import Modal from '../../components/Modal';
import Alert, { showAlert } from '../../components/Alert';
import ListOfItems from '../../components/ListOfItems';
import { capitalize } from '../../components/UsefulF';

/* ------------------------------------------------------------------- */
/*                              Products component
/* ------------------------------------------------------------------- */

export default class Products extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      catTitle: '',
      catImg: '',
      catImgTitle: 'Image for category',
      categories: [],
      products: [],
      alert: {
        show: false,
        value: '',
        class: '',
      }
    };

    this.inputs = [
      {
        type: 'text',
        id: 'catTitle',
        placeholder: 'Category title',
        onChange: this.handleCatTitleChange.bind(this),
      }
    ];

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.handleRenameItem = this.handleRenameItem.bind(this);
    this.handleCatTitleChange = this.handleCatTitleChange.bind(this);
    this.handleRemoveItem = this.handleRemoveItem.bind(this);
    this.handlePreviewImg = this.handlePreviewImg.bind(this);
    this.handleAlertClose = this.handleAlertClose.bind(this);
    this.showAlert = showAlert.bind(this);
  };

  handleOpenModal(e) {
    this.setState(state => ({isOpen: !state.isOpen}))
  }

  // Handle click on add button
  async handleAddItem(e) {
    // Prevent default page reload onSubmit
    e.preventDefault();

    // Stop running if there is no text (entered by accident for example)
    if (this.state.catTitle === '') {
      // Show error message
      clearTimeout(this.timer);
      this.timer = this.showAlert('Can not add category without title', 'Message_error');

      return
    };

    // Build data obj
    const data = {
      title: capitalize(this.state.catTitle),
      img: this.state.catImg
    };

    // Create Blob from data
    const blob = new Blob(
      [JSON.stringify(data)],
      {type: 'application/json'}
    );

    // Options for request
    const opts = {
      method: 'POST',
      body: blob
    };

    // Post data
    await fetch('/categories', opts)
    // in purpose to console.log() result
      .then(res => res.json())
      .then(data => {
        // Show success message
        if (data.status === 'already exist') {
          clearTimeout(this.timer);
          this.timer = this.showAlert('Already exists', 'Message_error');
        }
        else {
          clearTimeout(this.timer);
          this.timer = this.showAlert('Added new category', 'Message_success');
        };

        console.log(data)
      })
      .catch(err => console.log(err));

    // Reset input value
    this.setState({catTitle: ''});

    // Get new data
    await this.getCategories()
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

    this.setState({catImgTitle: file.name});

    // New reader
    const reader = new FileReader();

    // Handle load end event
    reader.onloadend = () => this.setState({catImg: reader.result});

    // Put reader.result into file
    if (file) reader.readAsDataURL(file);
  }

  async handleRenameItem(e) {
    const title = e.target.value;

    console.log(title);
  }

  // Handle click on remove button
  async handleRemoveItem(e) {
    // Define clicked category id
    const id = e.target.htmlFor;
    const rename = e.target.textContent;

    const inputValue = document.getElementById(id).value;

    // Find category title by id
    const title = capitalize(this.state.categories.find(item => item.id === id).title);

    // Ask if sure
    const confirm = window.confirm('Are you sure?');

    if (!confirm) return

    // Empty array for existing products
    let existProducts = [];

    // Check if there any products using this category
    await fetch(`/products?category=${title}`)
      .then(res => res.json())
      .then(data => existProducts = data)
      .catch(err => console.log(err));

    // Can't rename into empty string
    if (rename.toLowerCase() === 'rename' && inputValue === '') {
      clearTimeout(this.timer);
      this.timer = this.showAlert('Can\'t rename into empty string', 'Message_error');

      return
    };

    // If btn value is 'rename' and input Value !== initial title -> fetch PUT request to change category name
    // Also if there are any products with in this category -> PUT into them new category title
    if (rename.toLowerCase() === 'rename' && inputValue !== title) {
      let data = {
        title: capitalize(inputValue)
      };

      // Create Blob from data
      let blob = new Blob(
        [JSON.stringify(data)],
        {type: 'application/json'}
      );

      // Options for request
      let opts = {
        method: 'PUT',
        body: blob
      };

      // PUT new category title into category's collection in db
      await fetch(`/categories/${id}`, opts)
        .then(res => res.json())
        .then(res => console.log(res))
        .catch(err => console.log(err))

      // Stop running if there is no matching products
      if (existProducts.length < 1) return

      data = {
        category: capitalize(inputValue)
      };

      // Create Blob from data
      blob = new Blob(
        [JSON.stringify(data)],
        {type: 'application/json'}
      );

      // Options for request
      opts = {
        method: 'PUT',
        body: blob
      };

      // PUT new category title into matching products
      await existProducts.forEach( async item => {
        await fetch(`/products/${item._id}`, opts)
          .then(res => res.json())
          .then(res => console.log(res))
          .catch(err => console.log(err))
      });

      // Request again for updated categories and products
      this.getCategories();
      this.getProducts();

      return
    };

    // If there are products in category -> decline
    if (existProducts.length > 0) {
      clearTimeout(this.timer);
      this.timer = this.showAlert('Can\'t delete category with products in it', 'Message_error');

      return
    };

    await fetch(`/categories/${id}`, {method: 'DELETE'})
    // in purpose to console.log() result
      .then(res => res.json())
      .then(data => {
        // Show success message
        clearTimeout(this.timer);
        this.timer = this.showAlert('Category deleted', 'Message_success');

        console.log(data)
      })
      .catch(err => console.log(err));

    await this.getCategories()
  }

  // Handler for catTitle input value changes
  handleCatTitleChange(e) {
    // Check for ONLY english letters usage
    if (!e.target.value.match(/^[A-Za-z0-9\s()]*$/gi) && e.target.tagName === 'INPUT') {
      // Show error alert
      clearTimeout(this.timer);
      this.timer = this.showAlert('Only english letters are allowed', 'Message_error');

      return
    };

    this.setState({catTitle: capitalize(e.target.value)});
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
    // Get all categories before first render
    await this.getCategories();
    await this.getProducts();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  // Get categories
  getCategories() {
    return fetch('/categories')
      .then(res => res.json())
      .then(data => {
        // Lowercased all data
        let cats = data.map(item => ({
          title: item.title.toLowerCase().trim(),
          img: new Buffer(item.img.data).toString(),
          // img: new Buffer(item.img.data),
          id: item._id
        }));

        // Default sorting from a -> b
        cats.sort((a, b) => {
          return a.title.localeCompare(b.title);
        });

        // Update State
        this.setState({categories: cats})
      })
      .catch(err => console.log(err));
  }

  getProducts() {
    // Fetching data from server. Header 'data' specifies filename
    return fetch('/products')
      .then(res => res.json())
      .then(data => {
        // Default sorting by item
        data.sort((a, b) => {
          return a.title.localeCompare(b.title);
        });

        // Update State
        this.setState({products: data})
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <Wrapper addClass='Products' header='Products'>
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
            // addColumn={
            //   <td>
            //     <input type='text' />
            //   </td>
            // }
            showAlert={this.showAlert}
            onAdd={this.handleAddItem}
            onRename={this.handleRenameItem}
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





//
