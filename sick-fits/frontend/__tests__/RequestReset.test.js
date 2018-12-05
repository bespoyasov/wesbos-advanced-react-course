import {mount} from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import {MockedProvider} from 'react-apollo/test-utils'

import RequestReset, {
  REQUEST_RESET_MUTATION as query,
} from '../components/RequestReset'


const email = 'test@test.com'
const mocks = [{
  request: {
    query, 
    variables: {email}
  },
  result: {
    data: {
      requestReset: {
        __typename: 'message',
        message: 'success',
      }
    }
  }
}]


describe('<RequestReset />', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    )

    const form = wrapper.find('[data-test="request-reset"]')
    expect(toJSON(form)).toMatchSnapshot()
  })

  it('calls the mutation', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    )

    wrapper
      .find('input')
      .simulate('change', {
        target: { name: 'email', value: email }
      })

    wrapper
      .find('form')
      .simulate('submit')

    await wait()
    wrapper.update()

    expect(wrapper.text()).toContain('Success! Check your email')
  })
})