import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    difficulty: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    estimatedTime: {
      type: Number,
      min: 0,
      required: true
    },
    category: {
      type: String,
      enum: ['Coding', 'Documentation', 'Admin', 'Learning'],
      required: true
    },
    status: {
      type: String,
      enum: ['Backlog', 'In-Progress', 'Completed'],
      default: 'Backlog'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    actualTimeSpent: {
      type: Number,
      default: 0
    },
    lastStartedAt: {
      type: Date,
      default: null
    }
  },
  {
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      }
    }
  }
);

export const Task = mongoose.model('Task', taskSchema);
