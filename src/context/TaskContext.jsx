import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTask = () => useContext(TaskContext);

// Task reducer
const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TASKS':
      return {
        ...state,
        tasks: action.payload,
        filteredTasks: action.payload,
        loading: false
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        filteredTasks: state.filter === 'all' 
          ? [action.payload, ...state.filteredTasks]
          : state.filter === 'completed' && action.payload.completed
            ? [action.payload, ...state.filteredTasks]
            : state.filter === 'pending' && !action.payload.completed
              ? [action.payload, ...state.filteredTasks]
              : state.filteredTasks
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task._id === action.payload._id ? action.payload : task
        ),
        filteredTasks: state.filteredTasks.map(task => 
          task._id === action.payload._id ? action.payload : task
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload),
        filteredTasks: state.filteredTasks.filter(task => task._id !== action.payload)
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload,
        filteredTasks: action.payload === 'all'
          ? state.tasks
          : action.payload === 'completed'
            ? state.tasks.filter(task => task.completed)
            : state.tasks.filter(task => !task.completed)
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'REORDER_TASKS':
      return {
        ...state,
        tasks: action.payload,
        filteredTasks: state.filter === 'all'
          ? action.payload
          : state.filter === 'completed'
            ? action.payload.filter(task => task.completed)
            : action.payload.filter(task => !task.completed)
      };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const initialState = {
    tasks: [],
    filteredTasks: [],
    filter: 'all',
    loading: true,
    error: null
  };

  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Fetch tasks on initial load and when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      dispatch({ type: 'SET_TASKS', payload: [] });
    }
  }, [isAuthenticated]);

  // Fetch all tasks
  const fetchTasks = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await axios.get('/api/tasks', { withCredentials: true });
      dispatch({ type: 'SET_TASKS', payload: res.data });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.response?.data?.message || 'Failed to fetch tasks' 
      });
    }
  };

  // Add a new task
  const addTask = useCallback(async (taskData) => {
    try {
      const res = await axios.post('/api/tasks', taskData, { withCredentials: true });
      dispatch({ type: 'ADD_TASK', payload: res.data });
      return { success: true, task: res.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add task' 
      };
    }
  }, []);

  // Update a task
  const updateTask = useCallback(async (id, taskData) => {
    try {
      const res = await axios.put(`/api/tasks/${id}`, taskData, { withCredentials: true });
      dispatch({ type: 'UPDATE_TASK', payload: res.data });
      return { success: true, task: res.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update task' 
      };
    }
  }, []);

  // Toggle task completion status
  const toggleTaskCompletion = useCallback(async (id, completed) => {
    try {
      const res = await axios.patch(`/api/tasks/${id}/toggle`, { completed }, { withCredentials: true });
      dispatch({ type: 'UPDATE_TASK', payload: res.data });
      return { success: true, task: res.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to toggle task status' 
      };
    }
  }, []);

  // Delete a task
  const deleteTask = useCallback(async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`, { withCredentials: true });
      dispatch({ type: 'DELETE_TASK', payload: id });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete task' 
      };
    }
  }, []);

  // Set filter
  const setFilter = useCallback((filter) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  // Reorder tasks (for drag and drop)
  const reorderTasks = useCallback(async (reorderedTasks) => {
    dispatch({ type: 'REORDER_TASKS', payload: reorderedTasks });
    
    try {
      // Send the new order to the server
      await axios.post('/api/tasks/reorder', { tasks: reorderedTasks.map((task, index) => ({ 
        id: task._id, 
        order: index 
      }))}, { withCredentials: true });
      
      return { success: true };
    } catch (error) {
      // Even if the server update fails, we keep the UI updated
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to save task order' 
      };
    }
  }, []);

  return (
    <TaskContext.Provider value={{
      tasks: state.tasks,
      filteredTasks: state.filteredTasks,
      filter: state.filter,
      loading: state.loading,
      error: state.error,
      fetchTasks,
      addTask,
      updateTask,
      toggleTaskCompletion,
      deleteTask,
      setFilter,
      reorderTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
};