import React from 'react'
import PaginationStyles from './styles/PaginationStyles'
import gql from 'graphql-tag'
import {Query} from 'react-apollo'
import Head from 'next/head'
import Link from 'next/link'

import Error from './ErrorMessage'
import {prePage, perPage} from '../config'

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`

const Pagination = (props) => {
  return (
    <Query query={PAGINATION_QUERY}>
      {({data, loading, error}) => {
        if (loading) return <p>Loading...</p>
        if (error) return <Error error={error} />
        
        const {page} = props
        const count = data.itemsConnection.aggregate.count
        const pages = Math.ceil(count / perPage)
        const label = `Page ${page} of ${pages}`
        
        return (
          <PaginationStyles>
            <Head><title>Sick Fits! | {label}</title></Head>
            <Link prefetch href={{
              pathname: 'items', 
              query: {page: page - 1}}}>
              <a className='prev' aria-disabled={page <= 1}>&larr; Prev</a>
            </Link>
            
            <p>{label}</p>
            <p>{count} items total</p>

            <Link prefetch href={{
              pathname: 'items', 
              query: {page: page + 1}}}>
              <a className='next' aria-disabled={page >= pages}>Next &rarr;</a>
            </Link>
          </PaginationStyles>
        )
      }}
    </Query>
  )
}

export default Pagination