import Link from 'next/link'
import NavStyles from './styles/NavStyles'
import User from './User'
import Signout from './Signout'

const Nav = () => (
  <User>
    {({data: {self}}) => (
      <NavStyles>
        <Link href='/items'><a>Shop</a></Link>
        
        {!!self && (<>
          <Link href='/sell'><a>Sell</a></Link>
          <Link href='/orders'><a>Orders</a></Link>
          <Link href='/me'><a>Account</a></Link>
          <Signout />
        </>)}

        {!self && (
          <Link href='/signup'><a>Sign in</a></Link>
        )}
      </NavStyles>
    )}
  </User>
)

export default Nav