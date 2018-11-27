import React from 'react'
// always in cents!
import StripeCheckout from 'react-stripe-checkout'
import {Mutation} from 'react-apollo'
import Router from 'next/router'
import NProgress from 'nprogress'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'

import calcTotalPrice from '../lib/calcTotalPrice'
import Error from './ErrorMessage'
import User, {CURRENT_USER_QUERY} from './User'

const totalItems = (cart) =>
  cart.reduce((tally, cartItem) => tally + cartItem.quantity, 0)


// test card number
// 4242 4242 4242 4242

class TakeMyMoney extends React.Component {

  onToken = (res) => {
    console.log({res})
  }

  render() {
    return (
      <User>
        {({data: {self}}) => (
          <StripeCheckout
            description={`Order of ${totalItems(self.cart)} items`}
            amount={calcTotalPrice(self.cart)}
            name='Sick Fits!'
            image={self.cart[0].item && self.cart[0].item.image}
            stripeKey='pk_test_BSjaTiaHLkX0G5j19q4UgLcc'
            currency='USD'
            email={self.email}
            token={res => this.onToken(res)}>
            {this.props.children}
          </StripeCheckout>
        )}
      </User>
    )
  }
}

export default TakeMyMoney