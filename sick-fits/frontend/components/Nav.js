import Link from 'next/link'

const Nav = () => {
  return (
    <nav>
      <ul>
        <li><Link href='/sell'><a>Sell page</a></Link></li>
        <li><Link href='/'><a>Go home!</a></Link></li>
      </ul>
    </nav>
  )
}

export default Nav