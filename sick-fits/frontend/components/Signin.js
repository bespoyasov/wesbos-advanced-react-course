import React, {Component} from 'react'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'

import Form from './styles/Form'
import Error from './ErrorMessage'
import {CURRENT_USER_QUERY} from './User'


const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      name
      email
    }
  }
`


const initialState = {
  email: '',
  password: '',
}


class Signin extends Component {
  state = {...initialState}

  clearState = () => 
    this.setState(state => ({ ...initialState }))

  updateState = (e) => {
    const {name, value} = e.target
    this.setState(state => ({ [name]: value }))
  }

  render() {
    const {email, name, password} = this.state

    return (
      <Mutation 
        refetchQueries={[{query: CURRENT_USER_QUERY}]}
        mutation={SIGNIN_MUTATION} 
        variables={this.state}>
        {(signup, {error, loading}) => {
          return (
            <Form method='post' onSubmit={async e => {
              e.preventDefault()
              await signup()
              this.clearState()
            }}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Signin for an account</h2>
                <Error error={error} />
                <label>
                  Email
                  <input 
                    type='email' 
                    name='email'
                    placehodler='Email'
                    value={email} 
                    onChange={this.updateState} />
                </label>
                <label>
                  Password
                  <input 
                    type='password' 
                    name='password'
                    placehodler='Password'
                    value={password} 
                    onChange={this.updateState} />
                </label>
      
                <button type='submit'>Signin!</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}

export default Signin