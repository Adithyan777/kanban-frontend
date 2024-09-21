// app/(authenticated)/board/Task.js
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function Task({ id, title, description, status, priority, dueDate }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-red-100 text-red-800',
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded shadow cursor-move"
    >
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <div className="flex justify-between items-center">
        <span className={`text-xs font-semibold px-2 py-1 rounded ${priorityColors[priority]}`}>
          {priority}
        </span>
        {dueDate && (
          <span className="text-xs text-gray-500">
            Due: {new Date(dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
      <div className="text-xs text-gray-500 mt-2">{status}</div>
    </li>
  );
}