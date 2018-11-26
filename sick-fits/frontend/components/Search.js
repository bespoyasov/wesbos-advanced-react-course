import React from 'react'
import Downshift, {resetIdCounter} from 'downshift'
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

const routeToItem = (item) => {
  Router.push({
    pathname: `/item/`,
    query: {id: item.id},
  })
}

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
    resetIdCounter()
    const {items=[], loading} = this.state

    return (
      <SearchStyles>
        <Downshift 
          onChange={routeToItem}
          itemToString={item => 
            item === null ? '' : item.title}>
          {({
            getInputProps, 
            getItemProps, 
            highlightedIndex,
            inputValue,
            isOpen,
          }) => (
            <div>
              <ApolloConsumer>
                {(client) =>
                  <input {...getInputProps({
                    id: 'search',
                    type: 'search',
                    placeholder: 'Search for a product',
                    className: this.state.loading ? 'loading' : '',
                    onChange: e => {
                      e.persist()
                      this.onChange(e, client)
                    },
                  })} />}
              </ApolloConsumer>
              
              {isOpen 
                && <DropDown>
                  {items.map((item, index) =>
                    <DropDownItem 
                      {...getItemProps({item})}
                      highlighted={index === highlightedIndex}
                      key={item.id}>
                      <img 
                        src={item.image} 
                        alt={item.title}
                        width={50} />
      
                      {item.title}
                    </DropDownItem>)}

                  {!items.length && !loading && (
                    <DropDownItem>Nothing found</DropDownItem>
                  )}
                </DropDown>}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    )
  }
}

export default AutoComplete