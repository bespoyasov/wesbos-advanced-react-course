import React from 'react'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import {CURRENT_USER_QUERY} from './User'

const SIGNOUT_MUTATION = gql`
  mutation SIGNOUT_MUTATION {
    signout {
      message
    }
  }
`

const Signout = props => (
  <Mutation 
    refetchQueries={[{query: CURRENT_USER_QUERY}]}
    mutation={SIGNOUT_MUTATION}>
    {(signout) => (
      <button onClick={signout}>Sign out!</button>
    )}
  </Mutation>
)

export default Signout