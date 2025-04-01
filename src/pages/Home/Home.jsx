// src/pages/Home/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// Correct import path - go up two levels to src directory
import { auth, db } from '../../firebase';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Student Portfolio Platform</h1>
        <p className="text-xl text-gray-600 mb-8">Showcase your academic achievements, projects, and skills</p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">
            Create Your Portfolio
          </Link>
          <Link to="/login" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg">
            Sign In
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Academic Projects</h3>
            <p className="text-gray-600">Showcase your school assignments, EPQs, and research work.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Extracurricular Activities</h3>
            <p className="text-gray-600">Highlight your leadership roles, clubs, and competitions.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Skills & Resume</h3>
            <p className="text-gray-600">Present your skills, languages, and downloadable CV.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
