"use client";

import { useState, useEffect, useCallback } from 'react';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useToast } from '@/hooks/use-toast';
import useStateStore from '@/stores/stateStore';
import Column from './Column';

const statusColor = {
    'To Do': 'bg-yellow-200 text-yellow-800',
    'In Progress': 'bg-blue-200 text-blue-800',
    'Completed': 'bg-green-200 text-green-800'
};

const columnOrder = ['To Do', 'In Progress', 'Completed'];

export default function KanbanBoard({ tasks: initialTasks }) {
    const [tasks, setTasks] = useState(initialTasks);
    const { toast } = useToast();
    const { getFullUrl } = useStateStore();

    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const updateTaskStatus = useCallback(async (taskId, newStatus) => {
        try {
            const response = await fetch(getFullUrl(`/todos/${taskId}`), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update task status');
            }

            const updatedTask = await response.json();
            return updatedTask;
        } catch (error) {
            console.error('Error updating task status:', error);
            toast({
                title: "Error",
                description: "Failed to update task status",
                variant: "destructive"
            });
            throw error;
        }
    }, [getFullUrl, toast]);

    const findColumnForTask = useCallback((taskId) => {
        for (const column of columnOrder) {
            if ((tasks[column] || []).some(task => task._id === taskId)) {
                return column;
            }
        }
        return null;
    }, [tasks]);

    const handleDragStart = useCallback((event) => {
        const { active } = event;
        active.data.current = {
            initialColumn: findColumnForTask(active.id)
        };
    }, [findColumnForTask]);

    const handleDragOver = useCallback((event) => {
        const { active, over } = event;
        if (!over) return;

        const activeColumn = active.data.current.initialColumn;
        const overColumn = columnOrder.includes(over.id) ? over.id : findColumnForTask(over.id);

        if (activeColumn !== overColumn) {
            setTasks(prev => {
                const activeItems = prev[activeColumn];
                const overItems = prev[overColumn];

                if (!activeItems || !overItems) return prev;

                const activeIndex = activeItems.findIndex(item => item._id === active.id);
                const overIndex = overItems.findIndex(item => item._id === over.id);

                return {
                    ...prev,
                    [activeColumn]: [
                        ...activeItems.slice(0, activeIndex),
                        ...activeItems.slice(activeIndex + 1)
                    ],
                    [overColumn]: [
                        ...overItems.slice(0, overIndex),
                        { ...activeItems[activeIndex], status: overColumn },
                        ...overItems.slice(overIndex)
                    ]
                };
            });
        }
    }, [findColumnForTask]);

    const handleDragEnd = useCallback(async (event) => {
        const { active, over } = event;
        if (!over) return;

        const initialColumn = active.data.current.initialColumn;
        const finalColumn = columnOrder.includes(over.id) ? over.id : findColumnForTask(over.id);

        if (initialColumn !== finalColumn) {
            try {
                const updatedTask = await updateTaskStatus(active.id, finalColumn);
                setTasks(prev => {
                    const newTasks = { ...prev };
                    if (newTasks[initialColumn]) {
                        newTasks[initialColumn] = newTasks[initialColumn].filter(task => task._id !== active.id);
                    }
                    if (newTasks[finalColumn]) {
                        newTasks[finalColumn] = newTasks[finalColumn].map(task => 
                            task._id === active.id ? updatedTask : task
                        );
                    } else {
                        newTasks[finalColumn] = [updatedTask];
                    }
                    return newTasks;
                });
                toast({
                    title: "Success",
                    description: "Task status updated successfully",
                    variant: "success"
                });
            } catch (error) {
                // Revert the state if the API call fails
                setTasks(prev => {
                    const newTasks = { ...prev };
                    const task = newTasks[finalColumn].find(t => t._id === active.id);
                    newTasks[finalColumn] = newTasks[finalColumn].filter(t => t._id !== active.id);
                    newTasks[initialColumn] = [...newTasks[initialColumn], { ...task, status: initialColumn }];
                    return newTasks;
                });
            }
        }
    }, [findColumnForTask, updateTaskStatus, toast]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8">Kanban Board</h1>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-4">
                    {columnOrder.map((columnId) => (
                        <Column 
                            key={columnId} 
                            id={columnId} 
                            title={columnId} 
                            tasks={tasks[columnId] || []} 
                            color={statusColor[columnId]}
                        />
                    ))}
                </div>
            </DndContext>
        </div>
    );
}