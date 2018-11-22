import React, {Component} from 'react'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'

import Form from './styles/Form'
import Error from './ErrorMessage'


const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password) {
      id
      name
      email
    }
  }
`


const initialState = {
  name: '',
  email: '',
  password: '',
}


class Signup extends Component {
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
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
        {(signup, {error, loading}) => {
          return (
            <Form method='post' onSubmit={async e => {
              e.preventDefault()
              await signup()
              this.clearState()
            }}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Signup for an account</h2>
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
                  Name
                  <input 
                    type='text' 
                    name='name'
                    placehodler='Name'
                    value={name} 
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
      
                <button type='submit'>Signup!</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}

export default Signup