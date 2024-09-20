'use client';
import React from 'react'
import withAuth from '@/components/authHOC';

function page() {
  return (
      <div>page</div>
  )
}

export default withAuth(page)