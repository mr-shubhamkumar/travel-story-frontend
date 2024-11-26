import React from "react";
import { FaInbox } from "react-icons/fa";

const EmptyCard = ({ message = "No data available", icon = <FaInbox size={48} /> }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white border border-gray-300 rounded-lg shadow-md">
      <div className="text-gray-400 mb-4">{icon}</div>
      <p className="text-gray-600 text-lg font-medium">{message}</p>
    </div>
  );
};

const EmptyCardPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <EmptyCard message="Nothing to show here!" />
    </div>
  );
};

export default EmptyCardPage;
