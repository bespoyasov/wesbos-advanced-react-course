import ItemComponent from '../components/Item'
import {shallow} from 'enzyme'
import toJSON from 'enzyme-to-json'

const fakeItem = {
  id: 'test id',
  title: 'test title',
  price: 5000,
  description: 'test description',
  image: 'test image.jpeg',
  largeImage: 'test large image.jpg',
}

describe('<Item />', () => {
  it('renders and matches the snapshot', () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />)
    expect(toJSON(wrapper)).toMatchSnapshot()
  })
})