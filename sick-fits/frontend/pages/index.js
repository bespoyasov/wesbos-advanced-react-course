import Link from 'next/link'

const Home = () => (
  <div>
    <p>Hello world!</p>
    
    <Link href='/sell'>
      <a>Sell page</a>
    </Link>
  </div>
)

export default Home