import React, {Component} from 'react'
import {Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'

import Form from './styles/Form'
import Error from './ErrorMessage'
import format from '../lib/formatMoney'


export const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: {id: $id}) {
      id
      price
      title
      description
    }
  }
`

export const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $price: Int
    $description: String
  ) {
    updateItem(
      id: $id
      title: $title
      price: $price
      description: $description
    ) {
      id
      price
      title
      description
    }
  }
`

class UpdateItem extends Component {
  state = {}

  handleChange = e => {
    const {name, type, value} = e.target
    const val = type === 'number' ? parseFloat(value) : value
    return this.setState(state => ({ [name]: val }))
  }

  updateItem = async (e, updateItemMutation) => {
    e.preventDefault() 
    
    const {id} = this.props
    const response = await updateItemMutation({
      variables: { id, ...this.state }
    })
  }

  render() {
    const {title, price, description, image} = this.state
    const {id} = this.props

    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id }}>
        {({data, loading}) => {
          if (loading) return <p>Loading...</p>
          if (!data.item) return <p>Not Found</p>

          return <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
            {(updateItem, {loading, error}) => (
              <Form onSubmit={e => this.updateItem(e, updateItem)}>
                <Error error={error} />
                
                <fieldset disabled={loading} aria-busy={loading}>
                  <label>
                    Title
                    <input 
                      type='text' 
                      name='title' 
                      placeholder='Title' 
                      defaultValue={data.item.title}
                      onChange={this.handleChange}
                      required />
                  </label>

                  <label>
                    Price
                    <input 
                      type='number' 
                      name='price' 
                      placeholder='Price' 
                      defaultValue={data.item.price}
                      onChange={this.handleChange}
                      required />
                  </label>

                  <label>
                    Description
                    <textarea 
                      name='description' 
                      placeholder='Description' 
                      defaultValue={data.item.description}
                      onChange={this.handleChange}
                      required />
                  </label>

                  <button type='submit'>Save changes</button>
                </fieldset>
              </Form>
            )}
          </Mutation>

        }}
      </Query>
    )
  }
}

export default UpdateItem