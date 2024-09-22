import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function Task({ id, title, description, priority, dueDate, status}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <li 
        ref={setNodeRef} 
        style={style} 
        {...attributes} 
        {...listeners} 
        className={`bg-white p-3 rounded shadow transition-all duration-300 ease-in-out ${isDragging ? 'shadow-lg scale-105' : ''}`}
    >
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-2">
            <span>Priority: {priority}</span>
            <span>Due: {new Date(dueDate).toLocaleDateString()}</span>
        </div>
        <div className="mt-2 text-xs text-gray-500">Status: {status}</div>
    </li>
);
}