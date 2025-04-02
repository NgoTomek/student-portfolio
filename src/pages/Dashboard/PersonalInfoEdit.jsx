import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

const PersonalInfoEdit = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    school: '',
    year: '',
    bio: '',
    quote: '',
  });

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        if (!currentUser) return;

        const portfolioDocRef = doc(db, 'portfolios', currentUser.uid);
        const portfolioDoc = await getDoc(portfolioDocRef);

        if (portfolioDoc.exists() && portfolioDoc.data().personalInfo) {
          const personalInfo = portfolioDoc.data().personalInfo;
          setFormData({
            name: personalInfo.name || '',
            school: personalInfo.school || '',
            year: personalInfo.year || '',
            bio: personalInfo.bio || '',
            quote: personalInfo.quote || '',
          });
        }
      } catch (err) {
        setError('Failed to load personal information: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, [currentUser]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const portfolioDocRef = doc(db, 'portfolios', currentUser.uid);

      await updateDoc(portfolioDocRef, {
        personalInfo: {
          name: formData.name,
          school: formData.school,
          year: formData.year,
          bio: formData.bio,
          quote: formData.quote,
        },
        lastUpdated: new Date().toISOString(),
      });

      setSuccess('Personal information updated successfully!');
    } catch (err) {
      setError('Failed to update personal information: ' + err.message);
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
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Personal Information</h2>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">
              School
            </label>
            <input
              type="text"
              id="school"
              name="school"
              value={formData.school}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
            Year/Grade
          </label>
          <input
            type="text"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            rows="4"
            value={formData.bio}
            onChange={handleChange}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Write a short bio about yourself..."
            required
          ></textarea>
        </div>

        <div className="mb-6">
          <label htmlFor="quote" className="block text-sm font-medium text-gray-700 mb-1">
            Motivational Quote
          </label>
          <input
            type="text"
            id="quote"
            name="quote"
            value={formData.quote}
            onChange={handleChange}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Your favorite quote or personal motto"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfoEdit;
