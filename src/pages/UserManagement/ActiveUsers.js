import React from 'react'
import UserList from '../../components/UserList'

function ActiveUsers() {
  return (
    <UserList profileStatus="active" title="Active Users"/>
  )
}

export default ActiveUsers