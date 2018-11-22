import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Mutation} from 'react-apollo'
import gql from 'graphql-tag'

import Form from './styles/Form'
import Error from './ErrorMessage'
import {CURRENT_USER_QUERY} from './User'


const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!, 
    $password: String!, 
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken, 
      password: $password, 
      confirmPassword: $confirmPassword
    ) {
      id
      name
      email
    }
  }
`


const initialState = {
  password: '',
  confirmPassword: '',
}


class Reset extends Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired
  }

  state = {...initialState}

  updateState = (e) => {
    const {name, value} = e.target
    this.setState(state => ({ [name]: value }))
  }

  render() {
    const {password, confirmPassword} = this.state

    return (
      <Mutation 
        refetchQueries={[{query: CURRENT_USER_QUERY}]}
        mutation={RESET_MUTATION} 
        variables={{
          resetToken: this.props.resetToken,
          ...this.state,
        }}>
        {(resetPassword, {error, loading}) => {
          return (
            <Form method='post' onSubmit={async e => {
              e.preventDefault()
              await resetPassword()
            }}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Reset a password</h2>
                <Error error={error} />

                <label>
                  Password
                  <input 
                    type='password' 
                    name='password'
                    placehodler='Password'
                    value={password} 
                    onChange={this.updateState} />
                </label>

                <label>
                  Confirm password
                  <input 
                    type='password' 
                    name='confirmPassword'
                    placehodler='Confirm it'
                    value={confirmPassword} 
                    onChange={this.updateState} />
                </label>
      
                <button type='submit'>Reset!</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}

export default Reset