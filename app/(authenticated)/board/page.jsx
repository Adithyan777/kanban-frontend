// app/(authenticated)/board/page.js
'use client'

import { v4 as uuidv4 } from 'uuid';
import withAuth from '@/components/authHOC';
import KanbanBoard from './Board';
import useStateStore from '@/stores/stateStore';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

const initialTasks = {
  "In Progress": [
      {
          "_id": "66ee603bc73ec5029df99e38",
          "title": "jkanck",
          "description": "suii",
          "status": "In Progress",
          "priority": "Medium",
          "dueDate": "2024-09-20T00:00:00.000Z",
          "user": "66ec7c7f5c70243eed52ebba",
          "createdAt": "2024-09-21T05:57:15.876Z",
          "updatedAt": "2024-09-21T07:09:14.801Z",
          "__v": 0
      }
  ],
  "Completed": [
      {
          "_id": "66ee6c94c73ec5029df99e75",
          "title": "VBWVB",
          "description": "CBAVMB",
          "status": "Completed",
          "priority": "Low",
          "dueDate": "2024-09-25T00:00:00.000Z",
          "user": "66ec7c7f5c70243eed52ebba",
          "createdAt": "2024-09-21T06:49:56.850Z",
          "updatedAt": "2024-09-21T06:52:25.225Z",
          "__v": 0
      },
      {
          "_id": "66ee6d38c73ec5029df99e7e",
          "title": "almvl",
          "description": "vkvmk ",
          "status": "Completed",
          "priority": "High",
          "dueDate": "2024-09-04T00:00:00.000Z",
          "user": "66ec7c7f5c70243eed52ebba",
          "createdAt": "2024-09-21T06:52:40.472Z",
          "updatedAt": "2024-09-21T07:25:38.667Z",
          "__v": 0
      }
  ],
  "To Do": [
      {
          "_id": "66ee94e6ffee0050b5942bed",
          "title": "wknv",
          "description": "kvnw ",
          "status": "To Do",
          "priority": "Low",
          "dueDate": "2024-09-03T00:00:00.000Z",
          "user": "66ec7c7f5c70243eed52ebba",
          "createdAt": "2024-09-21T09:41:58.654Z",
          "updatedAt": "2024-09-21T09:41:58.654Z",
          "__v": 0
      }
  ]
}

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

