const Expense = require('../models/Expense');

// Get all expenses for a user
const getExpenses = async (req, res) => {
  try {
    const { user } = req.query;
    
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'User email is required' 
      });
    }

    const expenses = await Expense.find({ userEmail: user }).sort({ date: -1 });
    
    res.json({
      success: true,
      expenses
    });

  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching expenses' 
    });
  }
};

// Add new expense
const addExpense = async (req, res) => {
  try {
    const { title, amount, category, type, date, userEmail } = req.body;

    // Validation
    if (!title || !amount || !category || !type || !date || !userEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount must be greater than 0' 
      });
    }

    const expense = new Expense({
      title,
      amount,
      category,
      type,
      date,
      userEmail
    });

    await expense.save();

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      expense
    });

  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while adding expense' 
    });
  }
};

// Update expense
const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, type, date } = req.body;

    // Validation
    if (!title || !amount || !category || !type || !date) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    if (amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount must be greater than 0' 
      });
    }

    const expense = await Expense.findByIdAndUpdate(
      id,
      { title, amount, category, type, date },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ 
        success: false, 
        message: 'Expense not found' 
      });
    }

    res.json({
      success: true,
      message: 'Expense updated successfully',
      expense
    });

  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating expense' 
    });
  }
};

// Delete expense
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return res.status(404).json({ 
        success: false, 
        message: 'Expense not found' 
      });
    }

    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });

  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting expense' 
    });
  }
};

module.exports = {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense
};