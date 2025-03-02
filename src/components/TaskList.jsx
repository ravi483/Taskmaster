import React, { useCallback, useMemo, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import TaskItem from "./TaskItem";
import { useTask } from "../context/TaskContext";
import { ClipboardList } from "lucide-react";

const TaskList = () => {
  const {
    tasks, // Assuming `tasks` is the full list
    filteredTasks,
    loading,
    error,
    toggleTaskCompletion,
    deleteTask,
    reorderTasks,
    dispatch, // Ensure dispatch is available for updating tasks
  } = useTask();

  const [editingTask, setEditingTask] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Memoize filtered tasks
  const memoizedTasks = useMemo(() => (Array.isArray(filteredTasks) ? filteredTasks : []), [filteredTasks]);

  // Handle drag end
  const handleDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;

      const updatedTasks = [...memoizedTasks];
      const [movedItem] = updatedTasks.splice(result.source.index, 1);
      updatedTasks.splice(result.destination.index, 0, movedItem);

      reorderTasks(updatedTasks);
    },
    [memoizedTasks, reorderTasks]
  );

  // Handle task editing
  const handleEdit = (taskId) => {
    const taskToEdit = memoizedTasks.find((task) => task._id === taskId);
    if (taskToEdit) {
      setEditingTask(taskToEdit);
      setShowModal(true);
    }
  };

  // Handle saving edited task
  const handleSave = (updatedTask) => {
    dispatch({ type: "UPDATE_TASK", payload: updatedTask });
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-6">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (memoizedTasks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center transition-colors duration-200">
        <ClipboardList className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No tasks found</h3>
        <p className="text-gray-500 dark:text-gray-400">Add a new task to get started or try a different filter.</p>
      </div>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {memoizedTasks.map((task, index) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  index={index}
                  onToggleComplete={toggleTaskCompletion}
                  onDelete={deleteTask}
                  onEdit={handleEdit} // Pass the edit function to TaskItem
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Task Editing Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Edit Task</h2>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mb-4 dark:bg-gray-700 dark:text-white"
              value={editingTask?.title || ""}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
            />
            <div className="flex justify-end space-x-3">
              <button className="bg-gray-300 dark:bg-gray-600 px-4 py-2 rounded" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => handleSave(editingTask)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(TaskList);
