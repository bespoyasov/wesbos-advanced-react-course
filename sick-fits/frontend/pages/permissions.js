import PleaseSignin from '../components/PleaseSignin'
import PermissionsList from '../components/Permissions'

const Permissions = () => (
  <div>
    <PleaseSignin>
      <p>Permissions</p>
      <PermissionsList />
    </PleaseSignin>
  </div>
)

export default Permissions