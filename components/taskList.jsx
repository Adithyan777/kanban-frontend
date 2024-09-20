import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus } from "lucide-react";

// Placeholder function for fetching tasks
const fetchTasks = () => {
    // This should be replaced with an actual API call
    return Promise.resolve([
        { _id: '1', title: 'Complete project',description: 'complete the project' , status: 'In Progress', priority: 'High', dueDate: '2024-10-01' },
        { _id: '2', title: 'Review code', description: 'complete the projects' ,status: 'To Do', priority: 'Medium', dueDate: '2024-09-25' },
        { _id: '3', title: 'Update documentation', description: 'complete the projectz' , status: 'Completed', priority: 'Low', dueDate: '2024-09-15' },
        { _id: '4', title: 'Plan meeting', description: 'Plan the quarterly meeting', status: 'To Do', priority: 'High', dueDate: '2024-10-10' },
        { _id: '5', title: 'Fix bugs', description: 'Fix the reported bugs', status: 'In Progress', priority: 'Medium', dueDate: '2024-09-30' },
        { _id: '6', title: 'Deploy app', description: 'Deploy the new version of the app', status: 'Completed', priority: 'High', dueDate: '2024-09-20' }
    ]);
};

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState({ status: 'all', priority: 'all' });
    const [sort, setSort] = useState({ field: 'dueDate', order: 'asc' });
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchTasks().then(setTasks);
    }, []);

    const priorityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };

    const filteredAndSortedTasks = tasks
        .filter(task => 
            (filter.status !== 'all' ? task.status === filter.status : true) &&
            (filter.priority !== 'all' ? task.priority === filter.priority : true) &&
            (task.title.toLowerCase().includes(search.toLowerCase()) || task.description.toLowerCase().includes(search.toLowerCase()))
        )
        .sort((a, b) => {
            if (sort.field === 'priority') {
                const aPriority = priorityOrder[a.priority];
                const bPriority = priorityOrder[b.priority];
                if (aPriority < bPriority) return sort.order === 'asc' ? -1 : 1;
                if (aPriority > bPriority) return sort.order === 'asc' ? 1 : -1;
                return 0;
            } else {
                if (a[sort.field] < b[sort.field]) return sort.order === 'asc' ? -1 : 1;
                if (a[sort.field] > b[sort.field]) return sort.order === 'asc' ? 1 : -1;
                return 0;
            }
        });

    const handleSort = (field) => {
        setSort(prev => ({
            field,
            order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
        }));
    };

    const statusColor = {
        'To Do': 'bg-yellow-200 text-yellow-800',
        'In Progress': 'bg-blue-200 text-blue-800',
        'Completed': 'bg-green-200 text-green-800'
    };

    const priorityColor = {
        'Low': 'bg-gray-200 text-gray-800',
        'Medium': 'bg-orange-200 text-orange-800',
        'High': 'bg-red-200 text-red-800'
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Task List</h1>
                <Button><Plus className="mr-2 h-4 w-4" /> Add Task</Button>
            </div>

            <div className="flex gap-4 mb-4">
                <Input
                    placeholder="Search tasks by title or description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
                <Select onValueChange={(value) => setFilter(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="To Do">To Do</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                </Select>
                <Select onValueChange={(value) => setFilter(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('title')}>Title</TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('description')}>Description</TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>Status</TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('priority')}>Priority</TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('dueDate')}>Due Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredAndSortedTasks.map(task => (
                        <TableRow key={task._id}>
                            <TableCell>{task.title}</TableCell>
                            <TableCell>{task.description}</TableCell>
                            <TableCell>
                                <Badge className={`${statusColor[task.status]} hover:${statusColor[task.status]}`}>{task.status}</Badge>
                            </TableCell>
                            <TableCell>
                                <Badge className={`${priorityColor[task.priority]} hover:${priorityColor[task.priority]}`}>{task.priority}</Badge>
                            </TableCell>
                            <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default TaskList;