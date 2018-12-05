import {mount} from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import {MockedProvider} from 'react-apollo/test-utils'
import {ApolloConsumer} from 'react-apollo'

import Signup, {SIGNUP_MUTATION} from '../components/Signup'
import {CURRENT_USER_QUERY} from '../components/User'
import {fakeUser} from '../lib/testUtils'


function type(wrapper, name, value) {
  wrapper
    .find(`input[name="${name}"]`)
    .simulate('change', {
      target: {name, value}
    })
}

const self = fakeUser()

const mocks = [{
  // signup mock mutation
  request: {
    query: SIGNUP_MUTATION,
    variables: {
      email: self.email,
      name: self.name,
      password: 'test'
    }
  },
  result: {
    data: {
      signup: {
        __typename: 'User',
        id: 'abs123',
        email: self.email,
        name: self.name,
      }
    }
  }
}, {
  // current user query mock
  request: {
    query: CURRENT_USER_QUERY,
  },
  result: {
    data: {self}
  }
}]


describe('<Signup />', () => {
  it('renders and matches snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <Signup />
      </MockedProvider>
    )

    expect(toJSON(wrapper.find('form'))).toMatchSnapshot()
  })

  it('calls the mutation', async () => {
    let apolloClient

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client
            return <Signup />
          }}
        </ApolloConsumer>
      </MockedProvider>
    )

    await wait()
    wrapper.update()

    type(wrapper, 'name', self.name)
    type(wrapper, 'email', self.email)
    type(wrapper, 'password', 'test')
    wrapper.update()
    wrapper.find('form').simulate('submit')
    
    await wait()
    
    // query the user out of the apollo client
    const user = await apolloClient.query({query: CURRENT_USER_QUERY})
    expect(user.data.self).toMatchObject(self)
  })
})