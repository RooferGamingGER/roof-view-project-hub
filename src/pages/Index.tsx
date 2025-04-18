
import React, { useEffect, useState } from 'react';
import { Plus, Building2 } from 'lucide-react'; // Import Building2 icon
import { Link } from 'react-router-dom';
import Navbar from '@/components/Layout/Navbar';
import ProjectCard from '@/components/Projects/ProjectCard';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/mockApi';
import { Project } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await api.getProjects();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Project Dashboard</h1>
          <Button asChild>
            <Link to="/upload" className="flex items-center gap-2">
              <Plus size={18} />
              New Project
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="space-y-2">
                <Skeleton className="aspect-video w-full h-48" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-md">
            {error}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted p-8 rounded-full mb-4">
              <Building2 size={48} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl font-medium mb-2">No projects yet</h2>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first roof mapping project.
            </p>
            <Button asChild>
              <Link to="/upload" className="flex items-center gap-2">
                <Plus size={18} />
                Create Project
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
