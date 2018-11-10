import React, {Component} from 'react'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'

import Form from './styles/Form'
import Error from './ErrorMessage'
import format from '../lib/formatMoney'

import {
  imageUploadPreset as preset,
  imageUploadEndpoint as endpoint,
} from '../config'


export const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`

class CreateItem extends Component {
  state = {
    title: 'Some title',
    description: 'Some description',
    image: '',
    largeImage: '',
    price: 1500,
  }

  handleChange = e => {
    const {name, type, value} = e.target
    const val = type === 'number' ? parseFloat(value) : value
    return this.setState(state => ({ [name]: val }))
  }

  uploadFile = async e => {
    const files = e.target.files
    const data = new FormData()
    data.append('file', files[0])
    data.append('upload_preset', preset)

    const response = await fetch(endpoint, { method: 'POST', body: data })
    const file = await response.json()

    return this.setState(state => ({ 
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    }))
  }

  render() {
    const {title, price, description, image} = this.state

    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, {loading, error}) => (
          <Form onSubmit={async e => {
            e.preventDefault() 
            const response = await createItem()
            Router.push({
              pathname: '/item',
              query: {id: response.data.createItem.id}
            })
          }}>
            <Error error={error} />
            
            <fieldset disabled={loading} aria-busy={loading}>
              <label>
                Upload an image
                <input 
                  type='file' 
                  name='file' 
                  placeholder='Upload an image' 
                  onChange={this.uploadFile}
                  required />

                {!!image 
                  && <img 
                      alt='Upload preview'
                      width='200'
                      src={image} />}
              </label>

              <label>
                Title
                <input 
                  type='text' 
                  name='title' 
                  placeholder='Title' 
                  value={title}
                  onChange={this.handleChange}
                  required />
              </label>

              <label>
                Price
                <input 
                  type='number' 
                  name='price' 
                  placeholder='Price' 
                  value={price}
                  onChange={this.handleChange}
                  required />
              </label>

              <label>
                Description
                <textarea 
                  name='description' 
                  placeholder='Description' 
                  value={description}
                  onChange={this.handleChange}
                  required />
              </label>

              <button type='submit'>Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default CreateItem