import {MockedProvider} from 'react-apollo/test-utils'
import {mount} from 'enzyme'
import wait from 'waait'

import {
  fakeUser,
  signedInMocks,
  notSignedInMocks,
} from '../lib/testUtils'

import PleaseSignin from '../components/PleaseSignin'
import {CURRENT_USER_QUERY as query} from '../components/User'

const Hey = () => <p>Hey!</p>


describe('<PleaseSignin />', () => {
  it('renders popup to logged out users', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks(query)}>
        <PleaseSignin>
          <Hey />
        </PleaseSignin>
      </MockedProvider>
    )

    await wait()
    wrapper.update()

    expect(wrapper.text()).toContain('Please signin')
    expect(wrapper.find('Signin').exists()).toBe(true)
  })

  it('renders the child component when user is signed in', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks(query)}>
        <PleaseSignin>
          <Hey />
        </PleaseSignin>
      </MockedProvider>
    )

    await wait()
    wrapper.update()

    expect(wrapper.find('Hey').exists()).toBe(true)
  })
})