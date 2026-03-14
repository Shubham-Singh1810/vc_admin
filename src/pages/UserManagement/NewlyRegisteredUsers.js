import React from 'react'
import UserList from '../../components/UserList'

function NewlyRegisteredUsers() {
  return (
    <UserList profileStatus="registered" title="Newly Registered"/>
  )
}

export default NewlyRegisteredUsers