import ResetForm from '../components/Reset'

const Reset = (props) => (
  <div>
    <ResetForm 
      resetToken={props.query.resetToken} />
  </div>
)

export default Reset