import React from 'react';
import SectionTitle from '../../components/SectionTitle';
import SkillBadge from '../../components/SkillBadge';

const Resume = () => {
  // Sample skills data - in a real application, this would come from a database or CMS
  const technicalSkills = [
    { name: 'HTML/CSS', icon: '💻' },
    { name: 'JavaScript', icon: '🔧' },
    { name: 'React', icon: '⚛️' },
    { name: 'Python', icon: '🐍' },
    { name: 'Data Analysis', icon: '📊' },
    { name: 'Microsoft Office', icon: '📝' },
  ];

  const softSkills = [
    { name: 'Leadership', icon: '👑' },
    { name: 'Communication', icon: '🗣️' },
    { name: 'Teamwork', icon: '🤝' },
    { name: 'Problem Solving', icon: '🧩' },
    { name: 'Time Management', icon: '⏱️' },
    { name: 'Critical Thinking', icon: '🧠' },
  ];

  const languages = [
    { name: 'English (Native)', icon: '🇬🇧' },
    { name: 'French (Intermediate)', icon: '🇫🇷' },
    { name: 'Spanish (Basic)', icon: '🇪🇸' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Resume & Skills</h1>

        {/* CV Section */}
        <section className="mb-16">
          <SectionTitle title="Curriculum Vitae" subtitle="Professional summary and experience" />

          <div className="bg-white rounded-lg shadow-md p-8">
            {/* Education */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Education
              </h3>

              <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-medium text-gray-800">Example High School</h4>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    2020-Present
                  </span>
                </div>
                <p className="text-gray-600 mb-2">A-Levels (Expected 2025)</p>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>Mathematics</li>
                  <li>Physics</li>
                  <li>Computer Science</li>
                  <li>Chemistry</li>
                </ul>
              </div>

              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-medium text-gray-800">Example Secondary School</h4>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    2015-2020
                  </span>
                </div>
                <p className="text-gray-600 mb-2">GCSEs (2020)</p>
                <p className="text-gray-600">
                  9 GCSEs including Mathematics (9), English Language (8), English Literature (8),
                  Science (9,8)
                </p>
              </div>
            </div>

            {/* Experience */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Experience
              </h3>

              <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-medium text-gray-800">Volunteer Tutor</h4>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    2023-Present
                  </span>
                </div>
                <p className="text-gray-600 mb-2">Local Community Center</p>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>Provide weekly mathematics tutoring to GCSE students</li>
                  <li>Develop personalized learning plans for 5 students</li>
                  <li>Improved student grades by an average of 2 levels</li>
                </ul>
              </div>

              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-medium text-gray-800">Work Experience</h4>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Summer 2023
                  </span>
                </div>
                <p className="text-gray-600 mb-2">Local Tech Company</p>
                <ul className="list-disc pl-5 text-gray-600">
                  <li>Shadowed software development team for 2 weeks</li>
                  <li>Assisted with user testing for new application features</li>
                  <li>Participated in daily stand-up meetings and sprint planning</li>
                </ul>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                Achievements
              </h3>

              <ul className="list-disc pl-5 text-gray-600">
                <li>Regional Mathematics Competition - 2nd Place (2023)</li>
                <li>School Science Fair - 1st Place (2022)</li>
                <li>Duke of Edinburgh Bronze Award (2021)</li>
                <li>School Merit Award for Outstanding Academic Achievement (2020-2023)</li>
              </ul>
            </div>

            {/* Download CV Button */}
            <div className="mt-8 text-center">
              <a
                href="#"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Full CV (PDF)
              </a>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-16">
          <SectionTitle title="Key Skills" subtitle="Technical and soft skills" />

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Technical Skills</h3>
              <div className="flex flex-wrap gap-3">
                {technicalSkills.map((skill, index) => (
                  <SkillBadge key={index} name={skill.name} icon={skill.icon} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Soft Skills</h3>
              <div className="flex flex-wrap gap-3">
                {softSkills.map((skill, index) => (
                  <SkillBadge key={index} name={skill.name} icon={skill.icon} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Languages & Tools Section */}
        <section>
          <SectionTitle
            title="Languages & Tools"
            subtitle="Communication and software proficiency"
          />

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Languages</h3>
              <div className="flex flex-wrap gap-3">
                {languages.map((language, index) => (
                  <SkillBadge key={index} name={language.name} icon={language.icon} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Software & Tools</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center p-3 border border-gray-200 rounded-md">
                  <div className="bg-blue-100 p-2 rounded-md mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">Microsoft Word</span>
                </div>

                <div className="flex items-center p-3 border border-gray-200 rounded-md">
                  <div className="bg-green-100 p-2 rounded-md mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">Microsoft Excel</span>
                </div>

                <div className="flex items-center p-3 border border-gray-200 rounded-md">
                  <div className="bg-purple-100 p-2 rounded-md mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">PowerPoint</span>
                </div>

                <div className="flex items-center p-3 border border-gray-200 rounded-md">
                  <div className="bg-yellow-100 p-2 rounded-md mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-yellow-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">Visual Studio Code</span>
                </div>

                <div className="flex items-center p-3 border border-gray-200 rounded-md">
                  <div className="bg-red-100 p-2 rounded-md mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">Adobe Photoshop</span>
                </div>

                <div className="flex items-center p-3 border border-gray-200 rounded-md">
                  <div className="bg-indigo-100 p-2 rounded-md mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">GitHub</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Resume;
