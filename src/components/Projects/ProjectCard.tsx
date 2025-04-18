
import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import StatusBadge from './StatusBadge';
import { Project } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src={project.thumbnail || '/placeholder.svg'}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-2 right-2">
          <StatusBadge status={project.status} />
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <h3 className="text-lg font-medium line-clamp-1">{project.name}</h3>
      </CardHeader>
      
      <CardContent className="pb-2">
        {project.address && (
          <p className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
            <Building size={14} />
            <span className="line-clamp-1">{project.address}</span>
          </p>
        )}
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <Calendar size={14} />
          <span>Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
        </p>
      </CardContent>
      
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to={`/project/${project.id}`} className="flex items-center justify-center gap-2">
            View Details
            <ExternalLink size={14} />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
