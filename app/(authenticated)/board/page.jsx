// app/(authenticated)/board/page.js
'use client'

import { v4 as uuidv4 } from 'uuid';
import withAuth from '@/components/authHOC';
import KanbanBoard from './Board';
import useStateStore from '@/stores/stateStore';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

function groupTasksByStatus(tasks) {
  return tasks.reduce((acc, task) => {
    const { status } = task;

    if (!acc[status]) {
      acc[status] = [];
    }
    
    acc[status].push(task);
    return acc;
  }, {});
}

function page() {
  const { getFullUrl } = useStateStore();
  const { toast } = useToast();
  const [tasks, setTasks] = useState({
    'To Do': [],
    'In Progress': [],
    'Completed': []
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []); 

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
        const response = await fetch(getFullUrl('/todos'), {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data = await response.json();
        const grouped = groupTasksByStatus(data);
        setTasks(prevTasks => ({
          'To Do': grouped['To Do'] || [],
          'In Progress': grouped['In Progress'] || [],
          'Completed': grouped['Completed'] || [],
          ...grouped // Include any additional statuses
        }));
    } catch (error) {
        console.error('Error fetching tasks:', error);
        toast({ title: "Error", description: "Failed to fetch tasks", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    isLoading ? <div>Loading...</div> :
    <KanbanBoard tasks={tasks} />
  );
}

export default withAuth(page);

