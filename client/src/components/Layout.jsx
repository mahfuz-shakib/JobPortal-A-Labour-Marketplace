import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <Navbar />
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6">{children}</main>
    <Footer />
  </div>
);

export default Layout; 