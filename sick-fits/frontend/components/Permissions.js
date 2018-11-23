import {Query, Mutation} from 'react-apollo'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

import Error from './ErrorMessage'
import Table from './styles/Table'
import SickButton from './styles/SickButton'


const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
]

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      name
      email
      permissions
    }
  }
`


const Permissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({data, loading, error}) => (
      <div>
        <Error error={error} />
        <h2>Manage permissions</h2>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              {possiblePermissions.map(permission => 
                <th key={permission}>{permission}</th>)}
              <th>&darr;</th>
            </tr>
          </thead>

          <tbody>
            {data.users.map(user => 
              <UserPermissions 
                key={user.id} 
                user={user} />)}
          </tbody>
        </Table>
      </div>
    )}
  </Query>
)

export default Permissions


class UserPermissions extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array,
    }).isRequired
  }

  state = {
    permissions: this.props.user.permissions,
  }

  handlePermissionChange = e => {
    const {checked, value} = e.target
    let updated = [...this.state.permissions]
    if (checked) updated.push(value)
    else updated = updated.filter(p => p !== value)

    return this.setState(state => ({ 
      permissions: updated }))
  }

  render() {
    const {user} = this.props

    return (
      <Mutation 
        mutation={UPDATE_PERMISSIONS_MUTATION} 
        variables={{
          permissions: this.state.permissions,
          userId: user.id
        }}>
        {(updatePermissions, {data, loading, error}) => (
          <>
            {error && <tr>
              <td colSpan={8}>
                <Error error={error} />
              </td>
            </tr>}

            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              
              {possiblePermissions.map(permission => (
                <td key={permission}>
                  <label>
                    <input 
                      type='checkbox'
                      value={permission}
                      checked={this.state.permissions.includes(permission)}
                      onChange={this.handlePermissionChange} />
                  </label>
                </td>
              ))}

              <td>
                <SickButton 
                  onClick={updatePermissions}
                  disabled={loading}
                  type='button'>
                  Updat{loading ? 'ing' : 'e'}
                </SickButton>
              </td>
            </tr>
          </>
        )}
      </Mutation>
    )
  }
}