import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import Task from './Task';

export default function Column({ id, title, tasks, color }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className={`p-4 rounded-lg shadow-md w-80 ${color} transition-all duration-300 ease-in-out`}>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <SortableContext id={id} items={tasks} strategy={verticalListSortingStrategy}>
        <ul ref={setNodeRef} className="space-y-3 min-h-[50px] transition-all duration-300 ease-in-out">
          {tasks.map((task) => (
            <Task 
              key={task._id} 
              id={task._id} 
              title={task.title} 
              description={task.description} 
              priority={task.priority} 
              dueDate={task.dueDate} 
              status={task.status}
            />
          ))}
        </ul>
      </SortableContext>
    </div>
  );
}