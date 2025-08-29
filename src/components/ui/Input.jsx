import React from "react";

export default function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 text-sm border border-gray-300 rounded-xl 
                  focus:outline-none focus:border-indigo-600 
                  focus:ring-2 focus:ring-indigo-300 
                  transition duration-300 ${className}`}
    />
  );
}
