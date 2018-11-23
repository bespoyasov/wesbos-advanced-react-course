import React, {Component} from 'react'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import {ALL_ITEMS_QUERY} from './Items'


export const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`

class DeleteItem extends Component {
  // manually update cache on the client
  update = (cache, payload) => {
    const data = cache.readQuery({query: ALL_ITEMS_QUERY})
    data.items = data.items.filter(item => 
      item.id !== payload.data.deleteItem.id)

    cache.writeQuery({query: ALL_ITEMS_QUERY, data})
  }

  render() {
    const {children, id} = this.props
    
    return (
      <Mutation 
        mutation={DELETE_ITEM_MUTATION} 
        update={this.update}
        variables={{id}}>
        {(deleteItem, {error}) => {
          return <button onClick={() => {
            if (confirm('Are you sure?')) {
              deleteItem().catch(err => alert(err.message))
            }
          }}>{children}</button>
        }}
      </Mutation>
    )
  }
}

export default DeleteItem