import {mount} from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import {MockedProvider} from 'react-apollo/test-utils'
import Router from 'next/router'

import {fakeItem} from '../lib/testUtils'
import CreateItem, {
  CREATE_ITEM_MUTATION as query,
} from '../components/CreateItem'


Router.router = {
  push: jest.fn()
}


const dogImage = 'https://dog.com/dog.jpg'

global.fetch = jest.fn().mockResolvedValue({
  json: () => ({
    secure_url: dogImage,
    eager: [{secure_url: dogImage}],
  })
})


describe('<CreateItem />', () => {
  it('renders and matches snapshot', () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    )

    const form = wrapper.find('form[data-test="create-item-form"]')
    expect(toJSON(form)).toMatchSnapshot()
  })

  it('uploads file when change', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    )

    const fileInput = wrapper.find('input[type="file"]')
    fileInput.simulate('change', {
      target: {
        files: ['fakeDog.jpg']
      }
    })

    await wait()
    const component = wrapper.find('CreateItem').instance()
    expect(component.state.image).toEqual(dogImage)
    expect(component.state.largeImage).toEqual(dogImage)
    
    expect(global.fetch).toHaveBeenCalled()
    global.fetch.mockReset()
  })

  it('handles state updating', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    )

    wrapper
      .find('[name="title"]')
      .simulate('change', {target: {value: 'test', name: 'title'}})
    
    wrapper
      .find('[name="price"]')
      .simulate('change', {target: {value: 50000, name: 'price', type: 'number'}})
    
    // etc
    wrapper.update()
    
    expect(wrapper.find('CreateItem').instance().state).toMatchObject({
      title: 'test',
      price: 50000
    })
  })

  it('creates an item when the form is submitted', async () => {
    const item = fakeItem()
    
    const mocks = [{
      request: {
        query, 
        variables: {
          title: item.title,
          description: item.description,
          image: '',
          largeImage: '',
          price: item.price,
        }
      },
      result: {
        data: {
          createItem: {
            ...item,
            __typename: 'item'
          }
        }
      }
    }]

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CreateItem />
      </MockedProvider>
    )

    wrapper
      .find('[name="title"]')
      .simulate('change', {target: {value: item.title, name: 'title'}})
    
    wrapper
      .find('[name="price"]')
      .simulate('change', {target: {value: item.price, name: 'price', type: 'number'}})

    wrapper
      .find('[name="description"]')
      .simulate('change', {target: {value: item.description, name: 'description'}})

    wrapper.find('form').simulate('submit')

    await wait(50)
    expect(Router.router.push).toHaveBeenCalledWith({
      pathname: "/item", 
      query: {id: "abc123"}
    })
  })
})