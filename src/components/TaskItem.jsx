import React, { useState, useCallback } from "react";
import {
  CheckCircle,
  Circle,
  Edit,
  Trash2,
  Clock,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";
import { Draggable } from "react-beautiful-dnd";


const TaskItem = ({ task, index, onToggleComplete, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Format date to readable string
  const formatDate = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get priority icon based on priority level
  const getPriorityIcon = useCallback(() => {
    switch (task.priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <Clock className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-green-500" />;
    }
  }, [task.priority]);

  // Handle toggle complete
  const handleToggleComplete = useCallback(() => {
    onToggleComplete(task._id, !task.completed);
  }, [task._id, task.completed, onToggleComplete]);

  // Handle edit
  const handleEdit = useCallback(() => {
    onEdit(task.id);
  }, [task.id, onEdit]);

  // Handle delete
  const handleDelete = useCallback(() => {
    onDelete(task._id);
  }, [task._id, onDelete]);

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-3 border-l-4 transition-all duration-200 ${
            task.completed
              ? "border-green-500 dark:border-green-600"
              : task.priority === "high"
              ? "border-red-500 dark:border-red-600"
              : task.priority === "medium"
              ? "border-yellow-500 dark:border-yellow-600"
              : "border-blue-500 dark:border-blue-600"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <button
                onClick={handleToggleComplete}
                className="mt-1 focus:outline-none"
                aria-label={
                  task.completed ? "Mark as incomplete" : "Mark as complete"
                }
              >
                {task.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                )}
              </button>

              <div className="flex-1">
                <h3
                  className={`text-lg font-medium ${
                    task.completed
                      ? "text-gray-500 dark:text-gray-400 line-through"
                      : "text-gray-800 dark:text-white"
                  }`}
                >
                  {task.title}
                </h3>

                {task.description && (
                  <p
                    className={`mt-1 text-sm ${
                      task.completed
                        ? "text-gray-400 dark:text-gray-500"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {task.description}
                  </p>
                )}

                <div className="mt-2 flex items-center space-x-3">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    {getPriorityIcon()}
                    <span className="ml-1 capitalize">{task.priority}</span>
                  </div>

                  {task.dueDate && (
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`flex space-x-1 transition-opacity duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <button
                onClick={handleEdit}
                className="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 focus:outline-none"
                aria-label="Edit task"
              >
                <Edit className="h-4 w-4" />
              </button>

              <button
                onClick={handleDelete}
                className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 focus:outline-none"
                aria-label="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default React.memo(TaskItem);
