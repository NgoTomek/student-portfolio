import React from 'react';
import SectionTitle from '../../components/SectionTitle';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-xl p-8 mb-12">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Student Name</h1>
          <p className="text-xl mb-2">Year 12 • Example High School</p>
          <p className="text-lg italic">"Your motivational quote goes here. Something that inspires you."</p>
        </div>
      </div>

      {/* About Me Section */}
      <section className="mb-16">
        <SectionTitle 
          title="About Me" 
          subtitle="Get to know who I am and what I'm passionate about"
        />
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-48 h-48 rounded-full bg-gray-200 flex-shrink-0">
                {/* Placeholder for student photo */}
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex-1">
                <p className="text-gray-700 mb-4">
                  Hello! I'm a passionate student at Example High School with interests in [your interests]. 
                  I'm currently in Year 12 and working towards [your goals].
                </p>
                <p className="text-gray-700 mb-4">
                  Throughout my academic journey, I've developed a strong foundation in [subjects/skills] 
                  and have participated in various extracurricular activities that have shaped my character 
                  and enhanced my abilities.
                </p>
                <p className="text-gray-700">
                  I created this portfolio to showcase my academic achievements, projects, and leadership 
                  experiences. Feel free to explore and learn more about my journey!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="mb-16">
        <SectionTitle 
          title="My Goals" 
          subtitle="What I'm working towards"
        />
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Short-term</h3>
                <p className="text-gray-700">
                  To excel in my current studies and achieve top grades in my A-levels. 
                  To develop practical skills through personal projects and extracurricular activities.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Long-term</h3>
                <p className="text-gray-700">
                  To pursue higher education in [your field of interest] at a leading university.
                  To build a career that allows me to make a positive impact in [area of interest].
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section>
        <SectionTitle 
          title="Quick Links" 
          subtitle="Jump to sections of interest"
        />
        
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/projects" className="bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg p-6 text-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="font-medium">Projects</h3>
            </a>
            
            <a href="/leadership" className="bg-green-100 hover:bg-green-200 text-green-800 rounded-lg p-6 text-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="font-medium">Leadership</h3>
            </a>
            
            <a href="/resume" className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg p-6 text-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="font-medium">Resume</h3>
            </a>
            
            <a href="/contact" className="bg-red-100 hover:bg-red-200 text-red-800 rounded-lg p-6 text-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="font-medium">Contact</h3>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
