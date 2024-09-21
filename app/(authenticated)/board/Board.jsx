"use client";

import { useState,useEffect } from 'react';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Column from './Column';

// Define the color classes for different task statuses
const statusColor = {
    'To Do': 'bg-yellow-200 text-yellow-800',
    'In Progress': 'bg-blue-200 text-blue-800',
    'Completed': 'bg-green-200 text-green-800'
};

// Define the order of columns
const columnOrder = ['To Do', 'In Progress', 'Completed'];

export default function KanbanBoard({ tasks : initialTasks }) {
    // Initialize state to hold tasks
    const [tasks, setTasks] = useState(initialTasks);

    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);

    // Define sensors for drag and drop functionality
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Handle the drag over event
    function handleDragOver(event) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const activeContainer = findContainer(activeId);
        const overContainer = columnOrder.includes(overId) ? overId : findContainer(overId);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        // Update the tasks state to reflect the drag over event
        setTasks((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];

            const activeIndex = activeItems.findIndex((item) => item._id === activeId);
            const overIndex = overItems.findIndex((item) => item._id === overId);

            if (activeContainer === overContainer) {
                return {
                    ...prev,
                    [overContainer]: arrayMove(overItems, activeIndex, overIndex),
                };
            }

            // Remove the active item from its original container
            const updatedActiveContainer = prev[activeContainer].filter((item) => item._id !== active.id);

            // Insert the active item into the new container at the correct position
            const updatedOverContainer = [
                ...prev[overContainer].slice(0, overIndex),
                { ...tasks[activeContainer][activeIndex], status: overContainer },
                ...prev[overContainer].slice(overIndex),

            ];

            // Return the updated state with the active item moved to the new container
            return {
                ...prev,
                [activeContainer]: updatedActiveContainer,
                [overContainer]: updatedOverContainer,
            };
        });
    }

    // Handle the drag end event
    function handleDragEnd(event) {
        const { active, over } = event;
        if (!over) return;

        const activeContainer = findContainer(active.id);
        const overContainer = columnOrder.includes(over.id) ? over.id : findContainer(over.id);

        if (!activeContainer || !overContainer || activeContainer !== overContainer) {
            return;
        }

        const activeIndex = tasks[activeContainer].findIndex((task) => task._id === active.id);
        const overIndex = tasks[overContainer].findIndex((task) => task._id === over.id);

        if (activeIndex !== overIndex) {
            // Update the tasks state to reflect the drag end event
            setTasks((tasks) => ({
                ...tasks,
                [overContainer]: arrayMove(tasks[overContainer], activeIndex, overIndex),
            }));
        }
    }

    // Find the container (column) that contains the task with the given id
    function findContainer(id) {
        return Object.keys(tasks).find((key) => tasks[key].some((task) => task._id === id));
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8">Kanban Board</h1>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
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