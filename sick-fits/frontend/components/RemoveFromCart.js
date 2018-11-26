import React, {Component} from 'react'
import {Mutation} from 'react-apollo'
import styled from 'styled-components'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import {CURRENT_USER_QUERY} from './User'


const REMOVE_FROM_CART_MUTATION = gql`
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

  render() {
    const {id} = this.props

    return (
      <Mutation 
        refetchQueries={[{query: CURRENT_USER_QUERY}]}
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{id}}>
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