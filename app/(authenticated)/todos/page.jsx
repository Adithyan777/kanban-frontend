'use client';
import React from 'react'
import withAuth from '@/components/authHOC';
import TaskList from '@/components/taskList';

function page() {
  
  return (
    <div>
        <TaskList />
    </div>
  )
}

export default withAuth(page)