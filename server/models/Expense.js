const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Travel', 'Shopping', 'Tools', 'Transport', 'Rent', 'Utilities', 'Subscriptions', 'Education', 'Other']
  },
  type: {
    type: String,
    required: true,
    enum: ['Need', 'Want']
  },
  date: {
    type: Date,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);