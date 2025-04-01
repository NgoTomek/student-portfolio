import React from 'react';
import SectionTitle from '../../components/SectionTitle';
import ProjectCard from '../../components/ProjectCard';

const Projects = () => {
  // Sample project data - in a real application, this would come from a database or CMS
  const epqProjects = [
    {
      title: "Extended Project Qualification",
      description: "An in-depth research project exploring the impact of artificial intelligence on modern healthcare systems.",
      image: null, // Replace with actual image path when available
      tags: ["Research", "Healthcare", "Technology"],
      link: "#" // Replace with actual link when available
    }
  ];

  const schoolProjects = [
    {
      title: "Biology Research Paper",
      description: "A comprehensive analysis of cellular respiration and its role in energy production.",
      image: null, // Replace with actual image path when available
      tags: ["Biology", "Research", "Science"],
      link: "#" // Replace with actual link when available
    },
    {
      title: "History Essay",
      description: "An examination of the social and political factors that led to the Industrial Revolution.",
      image: null, // Replace with actual image path when available
      tags: ["History", "Essay", "Industrial Revolution"],
      link: "#" // Replace with actual link when available
    }
  ];

  const techProjects = [
    {
      title: "Personal Portfolio Website",
      description: "A responsive website built with React and Tailwind CSS to showcase my academic and extracurricular achievements.",
      image: null, // Replace with actual image path when available
      tags: ["React", "Tailwind CSS", "Web Development"],
      link: "#" // Replace with actual link when available
    },
    {
      title: "Data Analysis Project",
      description: "Using Python and Pandas to analyze climate change data and visualize trends over the past century.",
      image: null, // Replace with actual image path when available
      tags: ["Python", "Data Analysis", "Climate Change"],
      link: "#" // Replace with actual link when available
    }
  ];

  const groupProjects = [
    {
      title: "Science Fair Project",
      description: "A collaborative project investigating renewable energy sources and their efficiency in different environments.",
      image: null, // Replace with actual image path when available
      tags: ["Group Work", "Renewable Energy", "Science Fair"],
      link: "#" // Replace with actual link when available
    },
    {
      title: "Business Case Study Presentation",
      description: "A team presentation analyzing the business strategy of a major tech company and proposing improvements.",
      image: null, // Replace with actual image path when available
      tags: ["Business", "Presentation", "Team Work"],
      link: "#" // Replace with actual link when available
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">My Projects</h1>
        
        {/* EPQ Section */}
        <section className="mb-16">
          <SectionTitle 
            title="Extended Project Qualification" 
            subtitle="In-depth research and analysis"
          />
          
          <div className="space-y-8">
            {epqProjects.map((project, index) => (
              <ProjectCard 
                key={index}
                title={project.title}
                description={project.description}
                image={project.image}
                tags={project.tags}
                link={project.link}
              />
            ))}
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">About My EPQ</h3>
              <p className="text-gray-700 mb-4">
                The Extended Project Qualification (EPQ) allowed me to explore a topic of personal interest in great depth. 
                I chose to investigate [your EPQ topic] because [your reason].
              </p>
              <p className="text-gray-700 mb-4">
                Throughout this project, I developed valuable research skills including [skills developed]. 
                I conducted primary research through [methods] and analyzed secondary sources from [sources].
              </p>
              <p className="text-gray-700">
                This project taught me the importance of [lessons learned] and has strengthened my interest in [related field].
              </p>
            </div>
          </div>
        </section>
        
        {/* School Assignments Section */}
        <section className="mb-16">
          <SectionTitle 
            title="School Assignments" 
            subtitle="Notable academic work"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schoolProjects.map((project, index) => (
              <ProjectCard 
                key={index}
                title={project.title}
                description={project.description}
                image={project.image}
                tags={project.tags}
                link={project.link}
              />
            ))}
          </div>
        </section>
        
        {/* Coding/Tech Projects Section */}
        <section className="mb-16">
          <SectionTitle 
            title="Coding & Tech Projects" 
            subtitle="Technical skills in action"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {techProjects.map((project, index) => (
              <ProjectCard 
                key={index}
                title={project.title}
                description={project.description}
                image={project.image}
                tags={project.tags}
                link={project.link}
              />
            ))}
          </div>
        </section>
        
        {/* Group Work Section */}
        <section>
          <SectionTitle 
            title="Group Work & Presentations" 
            subtitle="Collaborative projects and team achievements"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groupProjects.map((project, index) => (
              <ProjectCard 
                key={index}
                title={project.title}
                description={project.description}
                image={project.image}
                tags={project.tags}
                link={project.link}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Projects;
