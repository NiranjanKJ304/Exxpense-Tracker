const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const getCategoryColor = (category) => {
    const colors = {
      Food: 'bg-red-100 text-red-800',
      Travel: 'bg-blue-100 text-blue-800',
      Shopping: 'bg-purple-100 text-purple-800',
      Tools: 'bg-gray-100 text-gray-800',
      Transport: 'bg-green-100 text-green-800',
      Rent: 'bg-yellow-100 text-yellow-800',
      Utilities: 'bg-indigo-100 text-indigo-800',
      Subscriptions: 'bg-pink-100 text-pink-800',
      Education: 'bg-orange-100 text-orange-800',
      Other: 'bg-teal-100 text-teal-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type) => {
    return type === 'Need' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{expense.title}</h3>
        <span className="text-xl font-bold text-green-600">${expense.amount}</span>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
          {expense.category}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(expense.type)}`}>
          {expense.type}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">{formatDate(expense.date)}</p>
      
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(expense)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(expense._id)}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExpenseCard;