import React, { Component } from 'react'
import CartStyles from './styles/CartStyles'
import Supreme from './styles/Supreme'
import CloseButton from './styles/CloseButton'
import SickButton from './styles/SickButton'

const Cart = props => {
  return <CartStyles>
    <header>
      <CloseButton title='close'>&times;</CloseButton>
      <Supreme>Your cart</Supreme>
      <p>You have __ items in your cart</p>
    </header>

    <footer>
      <p>$10.10</p>
      <SickButton>Checkout</SickButton>
    </footer>
  </CartStyles>
}

export default Cart