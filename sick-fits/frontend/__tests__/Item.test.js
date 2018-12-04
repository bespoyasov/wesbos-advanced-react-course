import ItemComponent from '../components/Item'
import {shallow} from 'enzyme'

const fakeItem = {
  id: 'test id',
  title: 'test title',
  price: 5000,
  description: 'test description',
  image: 'test image.jpeg',
  largeImage: 'test large image.jpg',
}

describe('<Item />', () => {
  it('renders price tag properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />)
    const PriceTag = wrapper.find('PriceTag')
    expect(PriceTag.dive().text()).toBe('$50')
  })

  it('renders title properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />)
    expect(wrapper.find('Title a').text()).toBe(fakeItem.title)
  })

  it('renders the image properly', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />)
    const Img = wrapper.find('img')
    expect(Img.props().src).toBe(fakeItem.image)
    expect(Img.props().alt).toBe(fakeItem.title)
  })

  it('renders out the buttons', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />)
    const buttonList = wrapper.find('.buttonList')
    expect(buttonList.children()).toHaveLength(3)
    expect(buttonList.find('Link').exists()).toBe(true)
    expect(buttonList.find('AddToCart').exists()).toBe(true)
    expect(buttonList.find('DeleteItem').exists()).toBe(true)
  })
})