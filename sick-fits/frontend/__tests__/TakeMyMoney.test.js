import {mount} from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import NProgress from 'nprogress'
import Router from 'next/router'
import {MockedProvider} from 'react-apollo/test-utils'
import {ApolloConsumer} from 'react-apollo'

import {fakeUser, fakeCartItem} from '../lib/testUtils'
import {CURRENT_USER_QUERY} from '../components/User'
import TakeMyMoney, {CREATE_ORDER_MUTATION} from '../components/TakeMyMoney'


Router.router = {
  push: jest.fn()
}

const mocks = [{
  request: {query: CURRENT_USER_QUERY},
  result: {
    data: {
      self: {
        ...fakeUser(),
        cart: [fakeCartItem({ id: 'abc123' })],
      }
    }
  }
}]

const createOrderMock = jest.fn().mockResolvedValue({
  data: {createOrder: {id: 'xyz789'}}
})


describe('<TakeMyMoney />', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    )

    await wait()
    wrapper.update()

    expect(toJSON(wrapper.find('ReactStripeCheckout'))).toMatchSnapshot()
  })

  it('creates an order', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    )

    const component = wrapper.find('TakeMyMoney').instance()
    
    // manually call onToken method
    component.onToken({id: 'abc123'}, createOrderMock)
    expect(createOrderMock).toHaveBeenCalledWith({variables: {token: 'abc123'}})
  })

  it('turns progress bar on', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    )

    await wait()
    wrapper.update()
    NProgress.start = jest.fn()

    const component = wrapper.find('TakeMyMoney').instance()
    component.onToken({id: 'abc123'}, createOrderMock)

    expect(NProgress.start).toHaveBeenCalled()
  })

  it('redirects to another page when completed', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    )

    await wait()
    wrapper.update()

    const component = wrapper.find('TakeMyMoney').instance()
    component.onToken({id: 'abc123'}, createOrderMock)

    expect(Router.router.push).toHaveBeenCalledWith({
      pathname: '/order',
      query: { id: 'xyz789' }
    })
  })
})