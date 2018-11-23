import {Query} from 'react-apollo'
import gql from 'graphql-tag'

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

const Permissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({data, loading, error}) => (
      <>
        <Error error={error} />
        <div>
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
                <User key={user.id} user={user} />)}
            </tbody>
          </Table>
        </div>
      </>
    )}
  </Query>
)

export default Permissions


class User extends React.Component {
  render() {
    const {user} = this.props

    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map(permission => (
          <td>
            <label>
              <input type='checkbox' />
            </label>
          </td>
        ))}

        <td>
          <SickButton>Update</SickButton>
        </td>
      </tr>
    )
  }
}