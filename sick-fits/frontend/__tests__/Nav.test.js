import {MockedProvider} from 'react-apollo/test-utils'
import {mount} from 'enzyme'
import toJSON from 'enzyme-to-json'
import wait from 'waait'

import {
  fakeUser,
  signedInMocks,
  notSignedInMocks,
} from '../lib/testUtils'

import Nav from '../components/Nav'
import {CURRENT_USER_QUERY as query} from '../components/User'


describe('<Nav />', () => {
  it('renders a minimal nav when signed out', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks(query)}>
        <Nav />
      </MockedProvider>
    )

    await wait()
    wrapper.update()

    const nav = wrapper.find('[data-test="nav"]')
    expect(toJSON(nav)).toMatchSnapshot()
  })

  it('renders full nav when signed in', async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks(query)}>
        <Nav />
      </MockedProvider>
    )

    await wait()
    wrapper.update()

    const nav = wrapper.find('ul[data-test="nav"]')
    expect(nav.children()).toHaveLength(6)
    expect(nav.text()).toContain('Sign out!')
  })
})