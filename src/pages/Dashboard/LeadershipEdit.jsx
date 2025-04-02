import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../contexts/AuthContext';

const LeadershipEdit = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [leadershipItems, setLeadershipItems] = useState([]);

  // New leadership item form state
  const [newItem, setNewItem] = useState({
    title: '',
    organization: '',
    description: '',
    startDate: '',
    endDate: '',
    ongoing: false,
    image: null,
    imageUrl: '',
  });

  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const fetchLeadershipItems = async () => {
      try {
        if (!currentUser) return;

        const portfolioDocRef = doc(db, 'portfolios', currentUser.uid);
        const portfolioDoc = await getDoc(portfolioDocRef);

        if (portfolioDoc.exists() && portfolioDoc.data().leadership) {
          setLeadershipItems(portfolioDoc.data().leadership);
        }
      } catch (err) {
        setError('Failed to load leadership items: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeadershipItems();
  }, [currentUser]);

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = e => {
    if (e.target.files[0]) {
      setNewItem(prev => ({
        ...prev,
        image: e.target.files[0],
      }));
    }
  };

  const uploadImage = async image => {
    if (!image) return null;

    const storageRef = ref(storage, `leadership/${currentUser.uid}/${Date.now()}_${image.name}`);
    await uploadBytes(storageRef, image);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      let imageUrl = newItem.imageUrl;

      // Upload image if a new one is selected
      if (newItem.image) {
        imageUrl = await uploadImage(newItem.image);
      }

      const itemData = {
        title: newItem.title,
        organization: newItem.organization,
        description: newItem.description,
        startDate: newItem.startDate,
        endDate: newItem.ongoing ? 'Present' : newItem.endDate,
        ongoing: newItem.ongoing,
        imageUrl: imageUrl,
        createdAt: new Date().toISOString(),
      };

      const portfolioDocRef = doc(db, 'portfolios', currentUser.uid);

      if (editMode && editIndex !== null) {
        // Update existing leadership item
        const updatedItems = [...leadershipItems];
        updatedItems[editIndex] = itemData;

        await updateDoc(portfolioDocRef, {
          leadership: updatedItems,
          lastUpdated: new Date().toISOString(),
        });

        setLeadershipItems(updatedItems);
        setSuccess('Leadership item updated successfully!');
      } else {
        // Add new leadership item
        await updateDoc(portfolioDocRef, {
          leadership: arrayUnion(itemData),
          lastUpdated: new Date().toISOString(),
        });

        setLeadershipItems([...leadershipItems, itemData]);
        setSuccess('Leadership item added successfully!');
      }

      // Reset form
      setNewItem({
        title: '',
        organization: '',
        description: '',
        startDate: '',
        endDate: '',
        ongoing: false,
        image: null,
        imageUrl: '',
      });
      setEditMode(false);
      setEditIndex(null);
    } catch (err) {
      setError('Failed to save leadership item: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = index => {
    const item = leadershipItems[index];
    setNewItem({
      title: item.title,
      organization: item.organization,
      description: item.description,
      startDate: item.startDate,
      endDate: item.ongoing ? '' : item.endDate,
      ongoing: item.ongoing,
      image: null,
      imageUrl: item.imageUrl || '',
    });
    setEditMode(true);
    setEditIndex(index);
  };

  const handleDelete = async index => {
    if (!window.confirm('Are you sure you want to delete this leadership item?')) {
      return;
    }

    try {
      setLoading(true);
      const updatedItems = leadershipItems.filter((_, i) => i !== index);

      const portfolioDocRef = doc(db, 'portfolios', currentUser.uid);

      await updateDoc(portfolioDocRef, {
        leadership: updatedItems,
        lastUpdated: new Date().toISOString(),
      });

      setLeadershipItems(updatedItems);
      setSuccess('Leadership item deleted successfully!');
    } catch (err) {
      setError('Failed to delete leadership item: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setNewItem({
      title: '',
      organization: '',
      description: '',
      startDate: '',
      endDate: '',
      ongoing: false,
      image: null,
      imageUrl: '',
    });
    setEditMode(false);
    setEditIndex(null);
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {editMode ? 'Edit Leadership Role' : 'Add Leadership Role'}
        </h2>

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
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Role/Position Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newItem.title}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label
                htmlFor="organization"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Organization/Club
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={newItem.organization}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={newItem.description}
              onChange={handleInputChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Describe your role, responsibilities, and achievements..."
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={newItem.startDate}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={newItem.endDate}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                disabled={newItem.ongoing}
                required={!newItem.ongoing}
              />
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="ongoing"
                    checked={newItem.ongoing}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-600">Currently active in this role</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Image (Optional)
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept="image/*"
            />
            {newItem.imageUrl && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Current image:</p>
                <img
                  src={newItem.imageUrl}
                  alt="Leadership role preview"
                  className="mt-2 h-32 w-auto object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            {editMode && (
              <button
                type="button"
                onClick={cancelEdit}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {saving ? 'Saving...' : editMode ? 'Update Role' : 'Add Role'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Leadership Roles</h2>

        {leadershipItems.length === 0 ? (
          <p className="text-gray-500 italic">You haven't added any leadership roles yet.</p>
        ) : (
          <div className="space-y-4">
            {leadershipItems.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 flex flex-col md:flex-row">
                {item.imageUrl && (
                  <div className="md:w-1/4 mb-4 md:mb-0 md:mr-4">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-32 w-full object-cover rounded-md"
                    />
                  </div>
                )}
                <div className={`${item.imageUrl ? 'md:w-3/4' : 'w-full'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                      <p className="text-gray-600">{item.organization}</p>
                      <p className="text-sm text-gray-500">
                        {item.startDate} - {item.ongoing ? 'Present' : item.endDate}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500">Don&apos;t forget to save your changes!</p>
    </div>
  );
};

export default LeadershipEdit;
