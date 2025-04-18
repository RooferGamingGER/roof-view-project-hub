
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Download, FileDown, Map } from 'lucide-react';
import { format } from 'date-fns';

import Navbar from '@/components/Layout/Navbar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatusBadge from '@/components/Projects/StatusBadge';
import GLBViewer from '@/components/Viewer/GLBViewer';
import { api } from '@/lib/mockApi';
import { Project } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await api.getProject(id);
        
        if (!data) {
          setError('Project not found');
        } else {
          setProject(data);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to fetch project:', err);
        setError('Failed to load project. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
    
    // Poll for updates if project is processing
    let intervalId: number | undefined;
    
    if (project && project.status === 'processing') {
      intervalId = window.setInterval(fetchProject, 5000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [id, project?.status]);

  const downloadResults = (url: string, filename: string) => {
    // In a real app, this would download the actual file
    console.log(`Downloading ${filename} from ${url}`);
    alert(`In a real app, this would download ${filename}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="h-8 w-32 mb-6" />
            <Skeleton className="h-12 w-3/4 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Skeleton className="h-80 col-span-2" />
              <div className="space-y-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-40" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </Button>
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-md text-center">
              <h2 className="text-xl font-medium mb-2">Error</h2>
              <p>{error || 'Failed to load project'}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="mb-2"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              {project.address && (
                <p className="text-muted-foreground">{project.address}</p>
              )}
            </div>
            <StatusBadge status={project.status} size="lg" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="model">
                <TabsList className="mb-4">
                  <TabsTrigger value="model">3D Model</TabsTrigger>
                  {project.hasOrthophoto && (
                    <TabsTrigger value="ortho">Orthophoto</TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="model" className="mt-0">
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="h-[70vh]">
                        <GLBViewer
                          modelUrl={project.results?.glbUrl || '/mock/placeholder.glb'}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {project.hasOrthophoto && (
                  <TabsContent value="ortho" className="mt-0">
                    <Card>
                      <CardContent className="p-0">
                        <div className="aspect-video bg-black flex items-center justify-center">
                          <Map size={48} className="text-muted-foreground" />
                          <p className="text-muted-foreground ml-2">
                            Orthophoto would be displayed here
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
              </Tabs>
            </div>
            
            <div>
              <div className="space-y-6">
                {/* Project Info Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <h2 className="text-lg font-medium">Project Information</h2>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-4 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Created</dt>
                        <dd className="flex items-center gap-2 font-medium">
                          <Calendar size={14} />
                          {format(new Date(project.createdAt), 'MMM d, yyyy')}
                        </dd>
                      </div>
                      
                      {project.processingParams && (
                        <>
                          <div>
                            <dt className="text-muted-foreground">Resolution</dt>
                            <dd className="font-medium capitalize">
                              {project.processingParams.resolution}
                            </dd>
                          </div>

                          <div>
                            <dt className="text-muted-foreground">Output Formats</dt>
                            <dd className="flex flex-wrap gap-2 mt-1">
                              <Badge variant="outline">
                                {project.processingParams.exportFormat}
                              </Badge>
                              {project.processingParams.generateOrthophoto && (
                                <Badge variant="outline">Orthophoto</Badge>
                              )}
                              {project.processingParams.generateDsmDtm && (
                                <Badge variant="outline">DSM/DTM</Badge>
                              )}
                            </dd>
                          </div>
                        </>
                      )}
                      
                      {project.notes && (
                        <div>
                          <dt className="text-muted-foreground">Notes</dt>
                          <dd className="font-medium">{project.notes}</dd>
                        </div>
                      )}
                    </dl>
                  </CardContent>
                </Card>
                
                {/* Downloads Card */}
                {project.status === 'done' && (
                  <Card>
                    <CardHeader className="pb-2">
                      <h2 className="text-lg font-medium">Downloads</h2>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {project.results?.glbUrl && (
                          <li>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start"
                              onClick={() => downloadResults(project.results!.glbUrl!, 'model.glb')}
                            >
                              <Download size={14} className="mr-2" />
                              3D Model (.glb)
                            </Button>
                          </li>
                        )}
                        
                        {project.results?.objUrl && (
                          <li>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start"
                              onClick={() => downloadResults(project.results!.objUrl!, 'model.obj')}
                            >
                              <Download size={14} className="mr-2" />
                              3D Model (.obj)
                            </Button>
                          </li>
                        )}
                        
                        {project.results?.tifUrl && project.hasOrthophoto && (
                          <li>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start"
                              onClick={() => downloadResults(project.results!.tifUrl!, 'orthophoto.tif')}
                            >
                              <Download size={14} className="mr-2" />
                              Orthophoto (.tif)
                            </Button>
                          </li>
                        )}
                        
                        {project.results?.zipUrl && (
                          <li>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start"
                              onClick={() => downloadResults(project.results!.zipUrl!, 'project.zip')}
                            >
                              <FileDown size={14} className="mr-2" />
                              All Files (.zip)
                            </Button>
                          </li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;
