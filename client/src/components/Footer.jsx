import React from 'react';

const Footer = () => (
  <footer className="w-full bg-gradient-to-tr from-gray-900 via-gray-950 to-blue-950 border-t border-gray-800 mt-auto px-6 py-12 text-gray-300">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
      {/* About */}
      <div>
        <div className="text-2xl font-extrabold text-blue-400 mb-3 tracking-tight">WorkMatch</div>
        <p className="text-gray-400 text-base leading-relaxed">WorkMatch (SkillConnect) is Bangladesh's modern job bidding platform connecting clients and skilled workers for all types of services. Simple, secure, and professional.</p>
      </div>
      {/* Quick Links */}
      <div>
        <div className="font-semibold text-gray-200 mb-3 text-lg">Quick Links</div>
        <ul className="space-y-2 text-base">
          <li><a href="/" className="hover:text-blue-400 transition">Home</a></li>
          <li><a href="/jobs" className="hover:text-blue-400 transition">Jobs</a></li>
          <li><a href="/workers" className="hover:text-blue-400 transition">Find Workers</a></li>
          <li><a href="/about" className="hover:text-blue-400 transition">About Us</a></li>
          <li><a href="/how-it-works" className="hover:text-blue-400 transition">How It Works</a></li>
          <li><a href="/contact" className="hover:text-blue-400 transition">Contact</a></li>
        </ul>
      </div>
      {/* Contact Info */}
      <div>
        <div className="font-semibold text-gray-200 mb-3 text-lg">Contact</div>
        <div className="text-base text-gray-400 mb-1">Email: <a href="mailto:support@workmatch.com" className="hover:text-blue-400 transition">support@workmatch.com</a></div>
        <div className="text-base text-gray-400 mb-1">Phone: <a href="tel:+880123456789" className="hover:text-blue-400 transition">+880 1234-56789</a></div>
        <div className="text-base text-gray-400">Address: Dhaka, Bangladesh</div>
      </div>
      {/* Social Media */}
      <div>
        <div className="font-semibold text-gray-200 mb-3 text-lg">Follow Us</div>
        <div className="flex gap-5 items-center mt-1">
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition text-2xl"><i className="fab fa-twitter"></i>Twitter</a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition text-2xl"><i className="fab fa-linkedin"></i>LinkedIn</a>
          <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition text-2xl"><i className="fab fa-facebook"></i>Facebook</a>
        </div>
      </div>
    </div>
    <div className="mt-10 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm tracking-wide">&copy; {new Date().getFullYear()} WorkMatch. All rights reserved.</div>
  </footer>
);

export default Footer; 