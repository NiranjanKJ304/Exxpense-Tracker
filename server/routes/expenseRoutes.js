const express = require('express');
const { 
  getExpenses, 
  addExpense, 
  updateExpense, 
  deleteExpense 
} = require('../controllers/expenseController');

const router = express.Router();

// GET /api/expenses?user=email
router.get('/expenses', getExpenses);

// POST /api/expenses
router.post('/expenses', addExpense);

// PUT /api/expenses/:id
router.put('/expenses/:id', updateExpense);

// DELETE /api/expenses/:id
router.delete('/expenses/:id', deleteExpense);

module.exports = router;