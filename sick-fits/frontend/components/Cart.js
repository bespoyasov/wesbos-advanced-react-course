import React from 'react'
import {Query, Mutation} from 'react-apollo'
import {adopt} from 'react-adopt'
import gql from 'graphql-tag'

import User from './User'
import CartItem from './CartItem'
import TakeMyMoney from './TakeMyMoney'
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


const Composed = adopt({
  // render used to remove errors in console
  user: ({render}) => 
    <User>{render}</User>,
  toggleCart: ({render}) => 
    <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>,
  localState: ({render}) => 
    <Query query={LOCAL_STATE_QUERY}>{render}</Query>,
})

const Cart = props => (
  <Composed>
    {({ user, toggleCart, localState }) => {
      const {self} = user.data
      const {data} = localState
      if (!self) return null

      return (
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
            {!!self.cart.length && (
              <TakeMyMoney>
                <SickButton>Checkout</SickButton>
              </TakeMyMoney>)}
          </footer>
        </CartStyles>
      )
    }}
  </Composed>
)

export default Cart