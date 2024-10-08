import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import useStateStore from '@/stores/stateStore';
import { DatePickerDemo } from './ui/datePicker';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

const endpoint = '/todos';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState({ status: 'all', priority: 'all' });
    const [sort, setSort] = useState({ field: 'dueDate', order: 'asc' });
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [editTask, setEditTask] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { getFullUrl } = useStateStore();
    const [editDate, setEditDate] = useState(editTask ? editTask.dueDate : undefined);
    const [date, setDate] = useState(undefined);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const { toast } = useToast();

    useEffect(() => {
        if (editTask) {
            setEditDate(editTask.dueDate);
        }
    }, [editTask]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(getFullUrl(endpoint), {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch tasks');
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            toast({ title: "Error", description: "Failed to fetch tasks", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTask = async (task) => {
        try {
            const response = await fetch(getFullUrl(endpoint), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(task)
            });
            if (!response.ok) throw new Error('Failed to create task');
            await fetchTasks();
            toast({ title: "Success", description: "Task created successfully" , variant: "success"});
        } catch (error) {
            console.error('Error creating task:', error);
            toast({ title: "Error", description: "Failed to create task", variant: "destructive" });
        }
    };

    const handleUpdateTask = async (task) => {
        try {
            const response = await fetch(getFullUrl(`${endpoint}/${task._id}`), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(task)
            });
            if (!response.ok) throw new Error('Failed to update task');
            await fetchTasks();
            toast({ title: "Success", description: "Task updated successfully" , variant: "success"});
        } catch (error) {
            console.error('Error updating task:', error);
            toast({ title: "Error", description: "Failed to update task", variant: "destructive" });
        }
    };

    const handleDeleteTask = async () => {
        if (!taskToDelete) return;
        try {
            const response = await fetch(getFullUrl(`${endpoint}/${taskToDelete._id}`), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete task');
            await fetchTasks();
            toast({ title: "Success", description: "Task deleted successfully", variant: "success" });
        } catch (error) {
            console.error('Error deleting task:', error);
            toast({ title: "Error", description: "Failed to delete task", variant: "destructive" });
        } finally {
            setIsDeleteDialogOpen(false);
            setTaskToDelete(null);
        }
    };

    const validateTask = (task) => {
        if (!task.title || task.title.trim() === '') return 'Title is required';
        if (!task.status) return 'Status is required';
        if (!task.priority) return 'Priority is required';
        if (!task.dueDate) return 'Due date is required';
        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const task = Object.fromEntries(formData.entries());

        if(editTask){
            task.dueDate = editDate ? editDate.split('T')[0] : '';
        }else{
            task.dueDate = date ? date.split('T')[0] : '';
        }
        
        const error = validateTask(task);
        if (error) {
          toast({ title: "Validation Error", description: error, variant: "destructive" });
          return;
        }
      
        if (editTask) {
            handleUpdateTask({ ...task, _id: editTask._id });
        } else {
            handleCreateTask(task);
        }
        setIsDialogOpen(false);
        setEditTask(null);
    };

    const priorityOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };

    const filteredAndSortedTasks = tasks
        .filter(task => 
            (filter.status !== 'all' ? task.status === filter.status : true) &&
            (filter.priority !== 'all' ? task.priority === filter.priority : true) &&
            (task.title.toLowerCase().includes(search.toLowerCase()) || task.description.toLowerCase().includes(search.toLowerCase()))
        )
        .sort((a, b) => {
            if (sort.field === 'priority') {
                return (priorityOrder[a.priority] - priorityOrder[b.priority]) * (sort.order === 'asc' ? 1 : -1);
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

    const renderSortIndicator = (field) => {
        if (sort.field !== field) return null;
        return sort.order === 'asc' ? <ArrowUp className="inline h-4 w-4 ml-1" /> : <ArrowDown className="inline h-4 w-4 ml-1" />;
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

    const TaskDialog = ({ task, isOpen, onOpenChange }) => {
        const [formState, setFormState] = useState({
            title: task?.title || '',
            description: task?.description || '',
            status: task?.status || '',
            priority: task?.priority || '',
            dueDate: task?.dueDate || '',
        });
    
        // Keep the form state synchronized with the task being edited (if any)
        useEffect(() => {
            if (task) {
                setFormState({
                    title: task.title || '',
                    description: task.description || '',
                    status: task.status || '',
                    priority: task.priority || '',
                    dueDate: task.dueDate || '',
                });
            }
        }, [task]);
    
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setFormState((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        };
    
        const handleDateChange = (selectedDate) => {
            setFormState((prevState) => ({
                ...prevState,
                dueDate: selectedDate,
            }));
        };
    
        const handleSubmit = (e) => {
            e.preventDefault();
    
            const error = validateTask(formState);
            if (error) {
                toast({ title: "Validation Error", description: error, variant: "destructive" });
                return;
            }
    
            if (task) {
                handleUpdateTask({ ...formState, _id: task._id });
            } else {
                handleCreateTask(formState);
            }
    
            onOpenChange(false);
        };
    
        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formState.title}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">Description</Label>
                                <Input
                                    id="description"
                                    name="description"
                                    value={formState.description}
                                    onChange={handleInputChange}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="status" className="text-right">Status</Label>
                                <Select
                                    name="status"
                                    value={formState.status}
                                    onValueChange={(value) => setFormState((prevState) => ({ ...prevState, status: value }))}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="To Do">To Do</SelectItem>
                                        <SelectItem value="In Progress">In Progress</SelectItem>
                                        <SelectItem value="Completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="priority" className="text-right">Priority</Label>
                                <Select
                                    name="priority"
                                    value={formState.priority}
                                    onValueChange={(value) => setFormState((prevState) => ({ ...prevState, priority: value }))}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="dueDate" className="text-right">Due Date</Label>
                                <DatePickerDemo date={formState.dueDate} setDate={handleDateChange} />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit">{task ? 'Update' : 'Create'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        );
    };
    

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h1 className="text-3xl font-bold mb-4 sm:mb-0">Task List</h1>
                <TaskDialog task={null} isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
                <Button onClick={() => { setEditTask(null); setIsDialogOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Task
                </Button>
            </div>
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full sm:w-auto"
                    />
                    <Select onValueChange={(value) => setFilter(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger className="w-full sm:w-[180px]">
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
                        <SelectTrigger className="w-full sm:w-[180px]">
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
                    <div className="hidden md:block">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <   TableHead className="cursor-pointer" onClick={() => handleSort('title')}>
                                Title {renderSortIndicator('title')}
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort('description')}>
                                Description {renderSortIndicator('description')}
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                                Status {renderSortIndicator('status')}
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort('priority')}>
                                Priority {renderSortIndicator('priority')}
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort('dueDate')}>
                                Due Date {renderSortIndicator('dueDate')}
                            </TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">Loading tasks...</TableCell>
                            </TableRow>
                        ) : filteredAndSortedTasks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">No tasks found</TableCell>
                            </TableRow>
                        ) : (
                            filteredAndSortedTasks.map(task => (
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
                                        <TaskDialog task={task} isOpen={editTask === task} onOpenChange={(open) => open ? setEditTask(task) : setEditTask(null)} />
                                        <Button variant="ghost" size="icon" onClick={() => setEditTask(task)}><Pencil className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" onClick={() => { setTaskToDelete(task); setIsDeleteDialogOpen(true); }}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="md:hidden">
                    {isLoading ? (
                        <p className="text-center">Loading tasks...</p>
                    ) : filteredAndSortedTasks.length === 0 ? (
                        <p className="text-center">No tasks found</p>
                    ) : (
                        filteredAndSortedTasks.map(task => (
                            <Card key={task._id} className="mb-4">
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <span>{task.title}</span>
                                        <div>
                                        <TaskDialog task={task} isOpen={editTask === task} onOpenChange={(open) => open ? setEditTask(task) : setEditTask(null)} />
                                            <Button variant="ghost" size="icon" onClick={() => setEditTask(task)}><Pencil className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => { setTaskToDelete(task); setIsDeleteDialogOpen(true); }}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-2">{task.description}</p>
                                    <div className="flex justify-between items-center">
                                        <Badge className={`${statusColor[task.status]} hover:${statusColor[task.status]}`}>{task.status}</Badge>
                                        <Badge className={`${priorityColor[task.priority]} hover:${priorityColor[task.priority]}`}>{task.priority}</Badge>
                                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete this task?</p>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteTask}>Delete</Button>
                </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TaskList;