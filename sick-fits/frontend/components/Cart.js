import React from 'react'
import {Query, Mutation} from 'react-apollo'
import gql from 'graphql-tag'

import User from './User'
import CartItem from './CartItem'
import calcTotalPrice from '../lib/calcTotalPrice'
import formatMoney from '../lib/formatMoney'

import CartStyles from './styles/CartStyles'
import Supreme from './styles/Supreme'
import CloseButton from './styles/CloseButton'
import SickButton from './styles/SickButton'

export const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`

export const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`

const Cart = props => {
  return <User>
    {({data: {self}}) => {
      if (!self) return null

      return (
        <Mutation mutation={TOGGLE_CART_MUTATION}>
          {(toggleCart) => (
            <Query query={LOCAL_STATE_QUERY}>
              {({data}) => (
                <CartStyles open={data.cartOpen}>
                  <header>
                    <CloseButton 
                      onClick={toggleCart}
                      title='close'>&times;</CloseButton>
                    <Supreme>{self.name}'s cart</Supreme>
                    <p>You have {self.cart.length} item{self.cart.length === 1 ? '' : 's'} in your cart</p>
                  </header>

                  <ul>
                    {self.cart.map(cartItem => 
                      <CartItem 
                        cartItem={cartItem}
                        key={cartItem.id} />)}
                  </ul>

          
                  <footer>
                    <p>{formatMoney(calcTotalPrice(self.cart))}</p>
                    <SickButton>Checkout</SickButton>
                  </footer>
                </CartStyles>
              )}
            </Query>
          )}
        </Mutation>
      )
    }}
  </User>
}

export default Cart