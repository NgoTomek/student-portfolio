import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../contexts/AuthContext';

const ProjectsEdit = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [projects, setProjects] = useState([]);

  // New project form state
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'academic', // Default category
    link: '',
    image: null,
    imageUrl: '',
  });

  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!currentUser) return;

        const portfolioDocRef = doc(db, 'portfolios', currentUser.uid);
        const portfolioDoc = await getDoc(portfolioDocRef);

        if (portfolioDoc.exists() && portfolioDoc.data().projects) {
          setProjects(portfolioDoc.data().projects);
        }
      } catch (err) {
        setError('Failed to load projects: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentUser]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = e => {
    if (e.target.files[0]) {
      setNewProject(prev => ({
        ...prev,
        image: e.target.files[0],
      }));
    }
  };

  const uploadImage = async image => {
    if (!image) return null;

    const storageRef = ref(storage, `projects/${currentUser.uid}/${Date.now()}_${image.name}`);
    await uploadBytes(storageRef, image);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      let imageUrl = newProject.imageUrl;

      // Upload image if a new one is selected
      if (newProject.image) {
        imageUrl = await uploadImage(newProject.image);
      }

      const projectData = {
        title: newProject.title,
        description: newProject.description,
        category: newProject.category,
        link: newProject.link,
        imageUrl: imageUrl,
        createdAt: new Date().toISOString(),
      };

      const portfolioDocRef = doc(db, 'portfolios', currentUser.uid);

      if (editMode && editIndex !== null) {
        // Update existing project
        const updatedProjects = [...projects];
        updatedProjects[editIndex] = projectData;

        await updateDoc(portfolioDocRef, {
          projects: updatedProjects,
          lastUpdated: new Date().toISOString(),
        });

        setProjects(updatedProjects);
        setSuccess('Project updated successfully!');
      } else {
        // Add new project
        await updateDoc(portfolioDocRef, {
          projects: arrayUnion(projectData),
          lastUpdated: new Date().toISOString(),
        });

        setProjects([...projects, projectData]);
        setSuccess('Project added successfully!');
      }

      // Reset form
      setNewProject({
        title: '',
        description: '',
        category: 'academic',
        link: '',
        image: null,
        imageUrl: '',
      });
      setEditMode(false);
      setEditIndex(null);
    } catch (err) {
      setError('Failed to save project: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = index => {
    const project = projects[index];
    setNewProject({
      title: project.title,
      description: project.description,
      category: project.category,
      link: project.link || '',
      image: null,
      imageUrl: project.imageUrl || '',
    });
    setEditMode(true);
    setEditIndex(index);
  };

  const handleDelete = async index => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      setLoading(true);
      const updatedItems = projects.filter((_, i) => i !== index);

      const portfolioDocRef = doc(db, 'portfolios', currentUser.uid);

      await updateDoc(portfolioDocRef, {
        projects: updatedItems,
        lastUpdated: new Date().toISOString(),
      });

      setProjects(updatedItems);
      setSuccess('Project deleted successfully!');
    } catch (err) {
      setError('Failed to delete project: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setNewProject({
      title: '',
      description: '',
      category: 'academic',
      link: '',
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
          {editMode ? 'Edit Project' : 'Add New Project'}
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
                Project Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newProject.title}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={newProject.category}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              >
                <option value="academic">Academic Assignment</option>
                <option value="epq">EPQ</option>
                <option value="coding">Coding/Tech Project</option>
                <option value="group">Group Work</option>
                <option value="other">Other</option>
              </select>
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
              value={newProject.description}
              onChange={handleInputChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Describe your project..."
              required
            ></textarea>
          </div>

          <div className="mb-6">
            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
              Project Link (Optional)
            </label>
            <input
              type="url"
              id="link"
              name="link"
              value={newProject.link}
              onChange={handleInputChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="https://example.com/project"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Project Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept="image/*"
            />
            {newProject.imageUrl && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Current image:</p>
                <img
                  src={newProject.imageUrl}
                  alt="Project preview"
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
              {saving ? 'Saving...' : editMode ? 'Update Project' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Projects</h2>

        {projects.length === 0 ? (
          <p className="text-gray-500 italic">You haven't added any projects yet.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index} className="border rounded-lg p-4 flex flex-col md:flex-row">
                {project.imageUrl && (
                  <div className="md:w-1/4 mb-4 md:mb-0 md:mr-4">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="h-32 w-full object-cover rounded-md"
                    />
                  </div>
                )}
                <div className={`${project.imageUrl ? 'md:w-3/4' : 'w-full'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase tracking-wide">
                        {project.category}
                      </span>
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
        )}
      </div>

      <p className="text-sm text-gray-500">Don&apos;t forget to save your changes!</p>
    </div>
  );
};

export default ProjectsEdit;
