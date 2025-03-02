import React, { useState, useCallback } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import FilterButtons from '../components/FilterButtons';
import { useTask } from '../context/TaskContext';

const Dashboard = () => {
  const { addTask, updateTask } = useTask();
  const [editingTask, setEditingTask] = useState(null);
  
  // Handle task submission (add or update)
  const handleTaskSubmit = useCallback(async (taskData) => {
    if (editingTask) {
      await updateTask(editingTask._id, taskData);
      setEditingTask(null);
    } else {
      await addTask(taskData);
    }
  }, [addTask, updateTask, editingTask]);
  
  // Handle cancel edit
  const handleCancelEdit = useCallback(() => {
    setEditingTask(null);
  }, []);
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Task Management Dashboard
      </h1>
      
      <TaskForm 
        task={editingTask}
        onSubmit={handleTaskSubmit}
        onCancel={handleCancelEdit}
      />
      
      <FilterButtons />
      
      <TaskList onEdit={setEditingTask} />
    </div>
  );
};

export default Dashboard;