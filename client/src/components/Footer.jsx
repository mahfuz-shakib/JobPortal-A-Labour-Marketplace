import React from 'react';

const Footer = () => (
  <footer className="w-full text-center py-6 bg-gray-100 border-t border-gray-200 mt-auto">
    <span className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} <span className="font-semibold text-blue-600">WorkMatch</span>. All rights reserved.</span>
  </footer>
);

export default Footer; 