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


const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`

// test card number
// 4242 4242 4242 4242
// https://dashboard.stripe.com/test/payments

class TakeMyMoney extends React.Component {

  onToken = async (res, createOrder) => {
    NProgress.start()

    const order = await createOrder({
      // manually call the mutation
      variables: {token: res.id}
    }).catch(err => 
      alert(err.message))

    Router.push({
      pathname: '/order',
      query: { id: order.data.createOrder.id }
    })
  }

  render() {
    return (
      <User>
        {({data: {self}}) => (
          <Mutation 
            refetchQueries={[{query: CURRENT_USER_QUERY}]}
            mutation={CREATE_ORDER_MUTATION}>
            {(createOrder, {data, loading, error}) => (
              <StripeCheckout
                description={`Order of ${totalItems(self.cart)} items`}
                amount={calcTotalPrice(self.cart)}
                name='Sick Fits!'
                image={self.cart[0] 
                  && self.cart[0].item 
                  && self.cart[0].item.image}
                stripeKey='pk_test_BSjaTiaHLkX0G5j19q4UgLcc'
                currency='USD'
                email={self.email}
                token={res => this.onToken(res, createOrder)}>
                {this.props.children}
              </StripeCheckout>
            )}
          </Mutation>
        )}
      </User>
    )
  }
}

export default TakeMyMoney