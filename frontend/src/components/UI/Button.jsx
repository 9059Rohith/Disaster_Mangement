import React from 'react';
const Button = ({ children, onClick, type = "button", color = "primary", className = "" }) => {
  const colorClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-300 hover:bg-gray-400 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded font-medium transition-colors ${colorClasses[color]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;