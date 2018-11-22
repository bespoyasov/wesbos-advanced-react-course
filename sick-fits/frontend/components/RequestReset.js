import React, {Component} from 'react'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'

import Form from './styles/Form'
import Error from './ErrorMessage'


const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`


const initialState = {
  email: '',
}


class RequestReset extends Component {
  state = {...initialState}

  updateState = (e) => {
    const {name, value} = e.target
    this.setState(state => ({ [name]: value }))
  }

  render() {
    const {email} = this.state

    return (
      <Mutation 
        mutation={REQUEST_RESET_MUTATION} 
        variables={this.state}>
        {(requestReset, {error, loading, called}) => {
          return (
            <Form method='post' onSubmit={async e => {
              e.preventDefault()
              await requestReset()
            }}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Reset a password</h2>
                <Error error={error} />

                {!error && !loading && called && (
                  <p>Success! Check your email</p>
                )}

                <label>
                  Email
                  <input 
                    type='email' 
                    name='email'
                    placehodler='Email'
                    value={email} 
                    onChange={this.updateState} />
                </label>
      
                <button type='submit'>Submit!</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}

export default RequestReset