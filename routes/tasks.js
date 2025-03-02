import express from 'express';
import Task from '../models/Task.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all tasks for the current user
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ order: 1, createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    
    // Get the highest order value
    const highestOrderTask = await Task.findOne({ user: req.user._id }).sort('-order');
    const order = highestOrderTask ? highestOrderTask.order + 1 : 0;
    
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      order,
      user: req.user._id
    });
    
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;
    
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.priority = priority || task.priority;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
    task.completed = completed !== undefined ? completed : task.completed;
    
    await task.save();
    
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Toggle task completion status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const { completed } = req.body;
    
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    task.completed = completed !== undefined ? completed : !task.completed;
    
    await task.save();
    
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reorder tasks
router.post('/reorder', async (req, res) => {
  try {
    const { tasks } = req.body;
    
    // Update each task's order in a transaction
    const updateOperations = tasks.map(task => {
      return Task.updateOne(
        { _id: task.id, user: req.user._id },
        { $set: { order: task.order } }
      );
    });
    
    await Promise.all(updateOperations);
    
    res.json({ message: 'Tasks reordered successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;