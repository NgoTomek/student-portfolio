import React from 'react';
import SectionTitle from '../../components/SectionTitle';

const Leadership = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Leadership & Extracurricular</h1>
        
        {/* Leadership Roles Section */}
        <section className="mb-16">
          <SectionTitle 
            title="Leadership Roles" 
            subtitle="Positions of responsibility and influence"
          />
          
          <div className="space-y-8">
            {/* School President Role */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-shrink-0 bg-blue-600 md:w-48 flex items-center justify-center p-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800">School President Candidate</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">2024-2025</span>
                  </div>
                  <p className="text-gray-600 mt-2 mb-4">
                    Ran for School President with a platform focused on improving student welfare, 
                    enhancing communication between students and staff, and promoting sustainability initiatives.
                  </p>
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-800 mb-2">Key Achievements:</h4>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      <li>Developed a comprehensive campaign strategy</li>
                      <li>Delivered persuasive speeches to the student body</li>
                      <li>Created policy proposals for school improvement</li>
                      <li>Built a campaign team of 10 fellow students</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Chess Tournament Role */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-shrink-0 bg-green-600 md:w-48 flex items-center justify-center p-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-800">Chess Club Captain</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">2023-Present</span>
                  </div>
                  <p className="text-gray-600 mt-2 mb-4">
                    Lead the school chess club, organizing weekly meetings, teaching new members, 
                    and representing the school in regional tournaments.
                  </p>
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-800 mb-2">Key Achievements:</h4>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      <li>Increased club membership by 40%</li>
                      <li>Organized inter-school chess tournament with 8 participating schools</li>
                      <li>Led team to 2nd place in regional championships</li>
                      <li>Implemented a mentoring system for new players</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Clubs & Activities Section */}
        <section className="mb-16">
          <SectionTitle 
            title="Clubs & Activities" 
            subtitle="Extracurricular involvement and achievements"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Debate Club */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Debate Club</h3>
              </div>
              <p className="text-gray-600 mb-3">
                Active member of the school debate team, participating in local and regional competitions.
              </p>
              <div className="text-sm text-gray-500">2022-Present</div>
            </div>
            
            {/* Science Olympiad */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Science Olympiad</h3>
              </div>
              <p className="text-gray-600 mb-3">
                Competed in chemistry and physics events, winning bronze medal in regional competition.
              </p>
              <div className="text-sm text-gray-500">2023-Present</div>
            </div>
            
            {/* Volunteer Work */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Community Volunteering</h3>
              </div>
              <p className="text-gray-600 mb-3">
                Regular volunteer at local food bank, contributing over 100 hours of service.
              </p>
              <div className="text-sm text-gray-500">2022-Present</div>
            </div>
            
            {/* Music */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800">School Orchestra</h3>
              </div>
              <p className="text-gray-600 mb-3">
                Violin player in the school orchestra, performing at school events and local venues.
              </p>
              <div className="text-sm text-gray-500">2021-Present</div>
            </div>
          </div>
        </section>
        
        {/* Media Gallery Section */}
        <section>
          <SectionTitle 
            title="Media Gallery" 
            subtitle="Photos and videos from various activities"
          />
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-6 text-center">
              A collection of memories from my extracurricular activities and leadership roles.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* These would be actual images in a real implementation */}
              <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
                View Full Gallery
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Leadership;
