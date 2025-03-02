import React, { useCallback } from 'react';
import { useTask } from '../context/TaskContext';
import { ListFilter, CheckCircle, Circle, List } from 'lucide-react';

const FilterButtons = () => {
  const { filter, setFilter, tasks = [] } = useTask(); // Default to an empty array if undefined
  
  // Ensure tasks is always an array before calling filter
  const completedCount = Array.isArray(tasks) ? tasks.filter(task => task.completed).length : 0;
  const pendingCount = Array.isArray(tasks) ? tasks.filter(task => !task.completed).length : 0;

  // Handle filter change
  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
  }, [setFilter]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 transition-colors duration-200">
      <div className="flex items-center mb-3">
        <ListFilter className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
        <h2 className="text-lg font-medium text-gray-800 dark:text-white">Filter Tasks</h2>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleFilterChange('all')}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            filter === 'all'
              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <List className="h-4 w-4 mr-1" />
          All
          <span className="ml-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full px-2 py-0.5">
            {Array.isArray(tasks) ? tasks.length : 0}
          </span>
        </button>
        
        <button
          onClick={() => handleFilterChange('completed')}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            filter === 'completed'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Completed
          <span className="ml-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full px-2 py-0.5">
            {completedCount}
          </span>
        </button>
        
        <button
          onClick={() => handleFilterChange('pending')}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            filter === 'pending'
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <Circle className="h-4 w-4 mr-1" />
          Pending
          <span className="ml-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full px-2 py-0.5">
            {pendingCount}
          </span>
        </button>
      </div>
    </div>
  );
};

export default React.memo(FilterButtons);
