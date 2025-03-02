import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  description: {
    type: String,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  order: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
taskSchema.index({ user: 1, order: 1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;