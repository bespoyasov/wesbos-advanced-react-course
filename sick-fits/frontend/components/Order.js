import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Query} from 'react-apollo'
import {format} from 'date-fns'
import Head from 'next/head'
import gql from 'graphql-tag'

import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'
import OrderStyles from './styles/OrderStyles'


const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(id: $id) {
      id
      charge
      total
      createdAt
      user {
        id
      }
      items {
        id
        title
        description
        price
        image
        quantity
      }
    }
  }
`


class Order extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  }

  render() {
    const {id} = this.props

    return (
      <Query 
        query={SINGLE_ORDER_QUERY}
        variables={{id}}>
        {({data, error, loading}) => {
          if (error) return <Error error={error} />
          if (loading) return <p>Loading...</p>

          const {order} = data
          const {
            id, 
            charge, 
            createdAt,
            total,
            items,
          } = order

          return (
            <OrderStyles>
              <Head><title>Sick Fits — Order {id}</title></Head>

              <p>
                <span>Order id:</span>
                <span>{id}</span>
              </p>

              <p>
                <span>Charge:</span>
                <span>{charge}</span>
              </p>

              <p>
                <span>Date:</span>
                <span>{format(createdAt, 'MMMM d, YYYY h:mm a')}</span>
              </p>

              <p>
                <span>Total amount:</span>
                <span>{formatMoney(total)}</span>
              </p>

              <p>
                <span>Items count:</span>
                <span>{items.length}</span>
              </p>

              <div className='items'>
                {order.items.map(item => (
                  <div className='order-item' key={item.id}>
                    <img src={item.image} alt={item.title} />
                    <div className='item-details'>
                      <h2>{item.title}</h2>
                      <p>Qty: {item.quantity}</p>
                      <p>Each: {formatMoney(item.price)}</p>
                      <p>Subtotal: {formatMoney(item.price * item.quantity)}</p>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </OrderStyles>
          )
        }}
      </Query>
    )
  }
}

export default Order