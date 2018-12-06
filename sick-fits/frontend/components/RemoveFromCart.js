import React, {Component} from 'react'
import {Mutation} from 'react-apollo'
import styled from 'styled-components'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import {CURRENT_USER_QUERY} from './User'


export const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromCart($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`


const BigButton = styled.button`
  font-size: 3rem;
  border: 0;
  background: none;
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.red};
  }
`


class RemoveFromCart extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  }

  // gets called as soon as we get a response from the server 
  // after a mutation has been performed
  update = (cache, payload) => {
    // read the cache
    const data = cache.readQuery({query: CURRENT_USER_QUERY})

    // remove that item from the cart
    const cartItemId = payload.data.removeFromCart.id
    data.self.cart = data.self.cart.filter(cartItem => 
      cartItem.id !== cartItemId)
    
    // write it back to the cache
    cache.writeQuery({
      query: CURRENT_USER_QUERY,
      data
    })
  }

  render() {
    const {id} = this.props

    return (
      <Mutation 
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{id}}
        update={this.update}
        optimisticResponse={{
          __typename: 'Mutation',
          removeFromCart: {
            __typename: 'CartItem',
            id
          }
        }}>
        {(removeFromCart, {loading, error}) => 
          <BigButton 
            disabled={loading}
            title='Delete item'
            onClick={() => {
              removeFromCart().catch(err => alert(err.message))
            }}>
            &times;
          </BigButton>}
      </Mutation>
    )
  }
}

export default RemoveFromCart