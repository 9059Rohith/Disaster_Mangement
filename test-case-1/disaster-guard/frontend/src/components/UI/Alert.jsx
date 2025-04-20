import React from 'react';

const Alert = ({ type = "info", message, className = "" }) => {
  const typeClasses = {
    success: "bg-green-100 text-green-800 border-green-200",
    error: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <div className={`p-3 rounded border ${typeClasses[type]} ${className}`}>
      {message}
    </div>
  );
};

export default Alert;