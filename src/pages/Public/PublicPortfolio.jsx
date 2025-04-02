import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchUserPortfolio, fetchUserProfile } from '../../services/portfolioService';

const PublicPortfolio = () => {
  const { userId } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user portfolio and profile
        const [portfolioData, profileData] = await Promise.all([
          fetchUserPortfolio(userId),
          fetchUserProfile(userId),
        ]);

        setPortfolio(portfolioData);
        setUserProfile(profileData);
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Failed to load portfolio. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!portfolio || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg max-w-md">
          <p className="font-bold">Portfolio Not Found</p>
          <p>The requested portfolio could not be found or is not available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              {portfolio.personalInfo?.name || userProfile.displayName}
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:text-xl md:max-w-3xl">
              {portfolio.personalInfo?.school} • {portfolio.personalInfo?.year}
            </p>
            <p className="mt-6 max-w-md mx-auto text-sm sm:text-base md:text-lg md:max-w-3xl italic">
              &quot;
              {portfolio.personalInfo?.quote ||
                'Education is the passport to the future, for tomorrow belongs to those who prepare for it today.'}
              &quot;
            </p>
          </div>
        </div>
      </div>

      {/* About Me Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-800">About Me</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <p className="text-gray-600 whitespace-pre-line">
              {portfolio.personalInfo?.bio || 'No bio available.'}
            </p>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
          </div>
          <div className="border-t border-gray-200">
            {portfolio.projects && portfolio.projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {portfolio.projects.map((project, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                    {project.imageUrl && (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase tracking-wide">
                            {project.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mt-2">{project.description}</p>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 mt-2 inline-block"
                        >
                          View Project →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 italic">No projects available.</div>
            )}
          </div>
        </div>
      </div>

      {/* Leadership Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-800">Leadership & Extracurricular</h2>
          </div>
          <div className="border-t border-gray-200">
            {portfolio.leadership && portfolio.leadership.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {portfolio.leadership.map((item, index) => (
                  <div key={index} className="p-6 flex flex-col md:flex-row">
                    {item.imageUrl && (
                      <div className="md:w-1/4 mb-4 md:mb-0 md:mr-6">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-48 w-full object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div className={`${item.imageUrl ? 'md:w-3/4' : 'w-full'}`}>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                        <p className="text-gray-600">{item.organization}</p>
                        <p className="text-sm text-gray-500">
                          {item.startDate} - {item.ongoing ? 'Present' : item.endDate}
                        </p>
                      </div>
                      <p className="text-gray-600 mt-2">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 italic">
                No leadership roles or extracurricular activities available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-800">Skills & Resume</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Key Skills</h3>
                {portfolio.skills && portfolio.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {portfolio.skills.map((skill, index) => (
                      <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        {skill.name} ({skill.level}/5)
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No skills listed.</p>
                )}

                <h3 className="text-lg font-medium text-gray-800 mt-6 mb-4">Languages</h3>
                {portfolio.languages && portfolio.languages.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {portfolio.languages.map((language, index) => (
                      <div
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full"
                      >
                        {language.name} ({language.proficiency})
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No languages listed.</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Tools & Software</h3>
                {portfolio.tools && portfolio.tools.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {portfolio.tools.map((tool, index) => (
                      <div
                        key={index}
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full"
                      >
                        {tool}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No tools or software listed.</p>
                )}

                {portfolio.resumeUrl && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Resume</h3>
                    <a
                      href={portfolio.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Download Resume
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-800">Contact</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Get in Touch</h3>
                <ul className="space-y-3">
                  {portfolio.contact?.email && (
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <a
                        href={`mailto:${portfolio.contact.email}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {portfolio.contact.email}
                      </a>
                    </li>
                  )}

                  {portfolio.contact?.phone && (
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <a
                        href={`tel:${portfolio.contact.phone}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {portfolio.contact.phone}
                      </a>
                    </li>
                  )}

                  {portfolio.contact?.website && (
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                      <a
                        href={portfolio.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {portfolio.contact.website}
                      </a>
                    </li>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Social Media</h3>
                <div className="flex flex-wrap gap-4">
                  {portfolio.contact?.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${portfolio.contact.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  )}

                  {portfolio.contact?.github && (
                    <a
                      href={`https://github.com/${portfolio.contact.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:text-gray-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                  )}

                  {portfolio.contact?.twitter && (
                    <a
                      href={`https://twitter.com/${portfolio.contact.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </a>
                  )}

                  {portfolio.contact?.instagram && (
                    <a
                      href={`https://instagram.com/${portfolio.contact.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()}{' '}
              {portfolio.personalInfo?.name || userProfile.displayName} • Student Portfolio
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicPortfolio;
