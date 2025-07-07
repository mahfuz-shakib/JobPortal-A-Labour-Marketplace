import React from 'react';
import { FaPhone, FaEnvelope, FaFacebook, FaLinkedin, FaHeart } from 'react-icons/fa';

const Footer = () => (
  <footer className="w-full bg-gray-900 text-gray-300 mt-auto">
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
        {/* Company Info */}
        <div>
          <h3 className="text-xl font-bold text-white mb-3">ওয়ার্কম্যাচ</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
          বাংলাদেশের আধুনিক জব বিডিং প্ল্যাটফর্ম, যেখানে ক্লায়েন্ট ও দক্ষ কর্মীরা সকল ধরনের সেবার জন্য সংযুক্ত হন।          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">লিঙ্কসমূহ</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-blue-400 transition-colors">হোম</a></li>
            <li><a href="/jobs" className="hover:text-blue-400 transition-colors">চাকরি দেখুন</a></li>
            <li><a href="/workers" className="hover:text-blue-400 transition-colors">কর্মী খুঁজুন</a></li>
            <li><a href="/how-it-works" className="hover:text-blue-400 transition-colors">কিভাবে কাজ করে</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <FaPhone className="text-blue-400" />
              <a href="tel:01746172301" className="hover:text-blue-400 transition-colors">01746-172301</a>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-blue-400" />
              <a href="mailto:mahfuzshakib301@gmail.com" className="hover:text-blue-400 transition-colors">mahfuzshakib301@gmail.com</a>
            </div>
            <div className="flex items-center gap-2">
              <FaFacebook className="text-blue-400" />
              <a href="https://www.facebook.com/mahfuz.shakib.73113528" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Facebook</a>
            </div>
            <div className="flex items-center gap-2">
              <FaLinkedin className="text-blue-400" />
              <a href="https://www.linkedin.com/in/mahfuzur-rahman-09575628a/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} WorkMatch. All rights reserved.
        </div>
        <div className="text-sm text-gray-400 flex items-center gap-1">
          Made with <FaHeart className="text-red-400" /> by 
          <span className="text-white font-medium">Mahfuzur Rahman Shakib</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer; 