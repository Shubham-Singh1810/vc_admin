import React from 'react'
import UserList from '../../components/UserList'

function BlockedUsers() {
  return (
    <UserList profileStatus="blocked" title="Blocked Users"/>
  )
}

export default BlockedUsers