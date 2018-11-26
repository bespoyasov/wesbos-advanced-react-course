import React from 'react'
import Downshift from 'downshift'
import Router from 'next/router'
import {ApolloConsumer} from 'react-apollo'
import gql from 'graphql-tag'
import debounce from 'lodash.debounce'
import {
  DropDown, 
  DropDownItem, 
  SearchStyles
} from './styles/DropDown'


const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String) {
    items(where: {
      OR: [
        {title_contains: $searchTerm},
        {description_contains: $searchTerm}
      ]
    }) {
      id
      image
      title
    }
  }
`

class AutoComplete extends React.Component {

  state = {
    items: [],
    loading: false,
  }

  onChange = debounce(async (e, client) => {
    this.setState(state => ({ loading: true }))

    // query apollo client manually
    const response = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm: e.target.value }
    })

    return this.setState(state => ({
      items: response.data.items,
      loading: false,
    }))
  }, 350)

  render() {
    return (
      <SearchStyles>
        <div>
          <ApolloConsumer>
            {(client) =>
              <input 
                type='search'
                onChange={e => {
                  e.persist()
                  this.onChange(e, client)
                }} />}
          </ApolloConsumer>
          <DropDown>
            {this.state.items.map(item =>
              <DropDownItem key={item.id}>
                <img 
                  src={item.image} 
                  alt={item.title}
                  width={50} />

                {item.title}
              </DropDownItem>)}
          </DropDown>
        </div>
      </SearchStyles>
    )
  }
}

export default AutoComplete