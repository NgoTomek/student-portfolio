import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Import page components (will create these next)
const Home = React.lazy(() => import('./pages/Home/Home'));
const Projects = React.lazy(() => import('./pages/Projects/Projects'));
const Leadership = React.lazy(() => import('./pages/Leadership/Leadership'));
const Resume = React.lazy(() => import('./pages/Resume/Resume'));
const Contact = React.lazy(() => import('./pages/Contact/Contact'));

function App() {
  return (
    <BrowserRouter>
      <React.Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="leadership" element={<Leadership />} />
            <Route path="resume" element={<Resume />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}

export default App;
