import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

const SkillsEdit = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Skills state
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', level: 3 });
  
  // Languages state
  const [languages, setLanguages] = useState([]);
  const [newLanguage, setNewLanguage] = useState({ name: '', proficiency: 'Intermediate' });
  
  // Tools state
  const [tools, setTools] = useState([]);
  const [newTool, setNewTool] = useState('');
  
  // Resume state
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const fetchSkillsData = async () => {
      try {
        if (!currentUser) return;
        
        const portfolioDocRef = doc(db, "portfolios", currentUser.uid);
        const portfolioDoc = await getDoc(portfolioDocRef);
        
        if (portfolioDoc.exists()) {
          const data = portfolioDoc.data();
          setSkills(data.skills || []);
          setLanguages(data.languages || []);
          setTools(data.tools || []);
          setResumeUrl(data.resumeUrl || '');
        }
      } catch (err) {
        setError("Failed to load skills data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSkillsData();
  }, [currentUser]);

  // Handle skill input changes
  const handleSkillChange = (e) => {
    const { name, value } = e.target;
    setNewSkill(prev => ({
      ...prev,
      [name]: name === 'level' ? parseInt(value) : value
    }));
  };

  // Add new skill
  const addSkill = () => {
    if (!newSkill.name.trim()) return;
    
    setSkills(prev => [...prev, newSkill]);
    setNewSkill({ name: '', level: 3 });
  };

  // Remove skill
  const removeSkill = (index) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };

  // Handle language input changes
  const handleLanguageChange = (e) => {
    const { name, value } = e.target;
    setNewLanguage(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new language
  const addLanguage = () => {
    if (!newLanguage.name.trim()) return;
    
    setLanguages(prev => [...prev, newLanguage]);
    setNewLanguage({ name: '', proficiency: 'Intermediate' });
  };

  // Remove language
  const removeLanguage = (index) => {
    setLanguages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle tool input change
  const handleToolChange = (e) => {
    setNewTool(e.target.value);
  };

  // Add new tool
  const addTool = () => {
    if (!newTool.trim()) return;
    
    setTools(prev => [...prev, newTool]);
    setNewTool('');
  };

  // Remove tool
  const removeTool = (index) => {
    setTools(prev => prev.filter((_, i) => i !== index));
  };

  // Handle resume file change
  const handleResumeChange = (e) => {
    if (e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  // Save all skills data
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      // Upload resume file if selected
      let resumeFileUrl = resumeUrl;
      if (resumeFile) {
        // In a real implementation, you would upload the file to Firebase Storage here
        // For this example, we'll just use a placeholder URL
        resumeFileUrl = URL.createObjectURL(resumeFile);
      }
      
      const portfolioDocRef = doc(db, "portfolios", currentUser.uid);
      
      await updateDoc(portfolioDocRef, {
        skills: skills,
        languages: languages,
        tools: tools,
        resumeUrl: resumeFileUrl,
        lastUpdated: new Date().toISOString()
      });
      
      setSuccess("Skills and resume information updated successfully!");
    } catch (err) {
      setError("Failed to update skills information: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Skills & Resume</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Skills Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Key Skills</h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill, index) => (
                <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                  <span>{skill.name} ({skill.level}/5)</span>
                  <button 
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Add a skill (e.g., Leadership, Coding, Writing)"
                  value={newSkill.name}
                  name="name"
                  onChange={handleSkillChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="w-32">
                <select
                  value={newSkill.level}
                  name="level"
                  onChange={handleSkillChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value={1}>1 - Beginner</option>
                  <option value={2}>2 - Basic</option>
                  <option value={3}>3 - Intermediate</option>
                  <option value={4}>4 - Advanced</option>
                  <option value={5}>5 - Expert</option>
                </select>
              </div>
              <button
                type="button"
                onClick={addSkill}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Skill
              </button>
            </div>
          </div>
          
          {/* Languages Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Languages</h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {languages.map((language, index) => (
                <div key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
                  <span>{language.name} ({language.proficiency})</span>
                  <button 
                    type="button"
                    onClick={() => removeLanguage(index)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Add a language (e.g., English, Spanish, French)"
                  value={newLanguage.name}
                  name="name"
                  onChange={handleLanguageChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="w-40">
                <select
                  value={newLanguage.proficiency}
                  name="proficiency"
                  onChange={handleLanguageChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Native">Native</option>
                </select>
              </div>
              <button
                type="button"
                onClick={addLanguage}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add Language
              </button>
            </div>
          </div>
          
          {/* Tools Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Tools & Software</h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {tools.map((tool, index) => (
                <div key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center">
                  <span>{tool}</span>
                  <button 
                    type="button"
                    onClick={() => removeTool(index)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Add a tool or software (e.g., Microsoft Office, Photoshop, Python)"
                  value={newTool}
                  onChange={handleToolChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <button
                type="button"
                onClick={addTool}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Add Tool
              </button>
            </div>
          </div>
          
          {/* Resume Upload Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Resume/CV</h3>
            
            <div className="mb-4">
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                Upload your resume (PDF format recommended)
              </label>
              <input
                type="file"
                id="resume"
                onChange={handleResumeChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept=".pdf,.doc,.docx"
              />
              {resumeUrl && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Current resume:</p>
                  <a 
                    href={resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 mt-1 inline-block"
                  >
                    View Resume
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillsEdit;
