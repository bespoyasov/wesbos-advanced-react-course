import SignupForm from '../components/Signup'
import SigninForm from '../components/Signin'
import styled from 'styled-components'

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`

const Signup = () => (
  <Columns>
    <SignupForm />
    <SigninForm />
  </Columns>
)

export default Signup