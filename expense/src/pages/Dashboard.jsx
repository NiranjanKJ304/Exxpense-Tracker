import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExpenseCard from '../components/ExpenseCard';
import FilterBar from '../components/ExpenseForm';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [message, setMessage] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    dateFrom: '',
    dateTo: ''
  });
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    type: '',
    date: ''
  });

  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  const categories = ['Food', 'Travel', 'Shopping', 'Tools', 'Transport', 'Rent', 'Utilities', 'Subscriptions', 'Education', 'Other'];

  useEffect(() => {
    if (!userEmail) {
      navigate('/login');
      return;
    }
    fetchExpenses();
  }, [userEmail, navigate]);

  useEffect(() => {
    applyFilters();
  }, [expenses, filters]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/expenses?user=${userEmail}`);
      const data = await response.json();
      
      if (data.success) {
        setExpenses(data.expenses);
      } else {
        setMessage('Failed to fetch expenses');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...expenses];

    if (filters.category) {
      filtered = filtered.filter(expense => expense.category === filters.category);
    }

    if (filters.type) {
      filtered = filtered.filter(expense => expense.type === filters.type);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(expense => new Date(expense.date) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filtered = filtered.filter(expense => new Date(expense.date) <= new Date(filters.dateTo));
    }

    setFilteredExpenses(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      type: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount),
      userEmail
    };

    try {
      let response;
      if (editingExpense) {
        response = await fetch(`http://localhost:5000/api/expenses/${editingExpense._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(expenseData),
        });
      } else {
        response = await fetch('http://localhost:5000/api/expenses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(expenseData),
        });
      }

      const data = await response.json();

      if (data.success) {
        setMessage(editingExpense ? 'Expense updated successfully!' : 'Expense added successfully!');
        fetchExpenses();
        resetForm();
      } else {
        setMessage(data.message || 'Operation failed');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount.toString(),
      category: expense.category,
      type: expense.type,
      date: expense.date.split('T')[0]
    });
    setShowAddForm(true);
  };

  const handleDelete = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/expenses/${expenseId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Expense deleted successfully!');
        fetchExpenses();
      } else {
        setMessage(data.message || 'Delete failed');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      amount: '',
      category: '',
      type: '',
      date: ''
    });
    setShowAddForm(false);
    setEditingExpense(null);
  };

  const calculateSummary = () => {
    const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const needsTotal = filteredExpenses.filter(e => e.type === 'Need').reduce((sum, expense) => sum + expense.amount, 0);
    const wantsTotal = filteredExpenses.filter(e => e.type === 'Want').reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      total,
      needsTotal,
      wantsTotal,
      needsPercentage: total > 0 ? ((needsTotal / total) * 100).toFixed(1) : 0,
      wantsPercentage: total > 0 ? ((wantsTotal / total) * 100).toFixed(1) : 0
    };
  };

  const summary = calculateSummary();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Expense Dashboard</h1>
        <p className="text-gray-600">Welcome back, {userEmail}</p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-500 text-white p-6 rounded-lg">
          <h3 className="text-sm font-medium">Total Spending</h3>
          <p className="text-2xl font-bold">${summary.total.toFixed(2)}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg">
          <h3 className="text-sm font-medium">Needs</h3>
          <p className="text-2xl font-bold">${summary.needsTotal.toFixed(2)}</p>
          <p className="text-xs">{summary.needsPercentage}% of total</p>
        </div>
        <div className="bg-orange-500 text-white p-6 rounded-lg">
          <h3 className="text-sm font-medium">Wants</h3>
          <p className="text-2xl font-bold">${summary.wantsTotal.toFixed(2)}</p>
          <p className="text-xs">{summary.wantsPercentage}% of total</p>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded-lg">
          <h3 className="text-sm font-medium">Total Expenses</h3>
          <p className="text-2xl font-bold">{filteredExpenses.length}</p>
        </div>
      </div>

      {/* Add Expense Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          {showAddForm ? 'Cancel' : 'Add New Expense'}
        </button>
      </div>

      {/* Add/Edit Expense Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingExpense ? 'Edit Expense' : 'Add New Expense'}
          </h3>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Expense title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                required
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                name="type"
                required
                value={formData.type}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="Need">Need</option>
                <option value="Want">Want</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
              >
                {editingExpense ? 'Update Expense' : 'Add Expense'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-md ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* Filter Bar */}
      <FilterBar 
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      {/* Expenses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map(expense => (
            <ExpenseCard
              key={expense._id}
              expense={expense}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No expenses found</p>
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Add Your First Expense
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;