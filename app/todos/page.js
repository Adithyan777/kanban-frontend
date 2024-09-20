'use client';
import React from 'react'
import withAuth from '@/components/authHOC';

function page() {
    const user = JSON.parse(localStorage.getItem('user'))
    const token = localStorage.getItem('token')
    console.log(user)

  return (
    <div>
      <h1>{user.id}</h1>
      <h1>{user.email}</h1>
      <h1>{user.username}</h1>
      <h1>{token}</h1>
    </div>
  )
}

export default withAuth(page)