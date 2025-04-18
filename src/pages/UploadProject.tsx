
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Navbar from '@/components/Layout/Navbar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

import DropZone from '@/components/Upload/DropZone';
import ProcessingParams from '@/components/Forms/ProcessingParams';
import { api } from '@/lib/mockApi';
import { ProcessingParameters } from '@/types';

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Project name must be at least 3 characters",
  }),
  address: z.string().optional(),
  notes: z.string().optional(),
});

const UploadProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [processingParams, setProcessingParams] = useState<ProcessingParameters>({
    resolution: 'medium',
    generateMesh: true,
    generateOrthophoto: true,
    generateDsmDtm: false,
    exportFormat: 'GLB',
    outputCoordinateSystem: '25832',
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      notes: '',
    },
  });

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one file.",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);

      // Create project with API
      await api.createProject({
        name: values.name,
        address: values.address,
        files: files,
        processingParams,
      });

      toast({
        title: "Project Created",
        description: "Your project has been created and is now processing.",
      });

      // Navigate back to dashboard
      navigate('/');
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>

          <h1 className="text-2xl font-bold mb-6">Upload New Project</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Residential Roof - Main St" {...field} />
                      </FormControl>
                      <FormDescription>
                        A descriptive name for your roof project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 123 Main St, Springfield" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any additional details about this project"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />
              
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Upload Files</h2>
                <p className="text-sm text-muted-foreground">
                  Upload drone images (.jpg, .png) or a pre-processed .glb model file
                </p>
                <DropZone onFilesAdded={handleFilesAdded} />
              </div>
              
              <div className="space-y-4">
                <ProcessingParams
                  params={processingParams}
                  onChange={setProcessingParams}
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={uploading || files.length === 0}
                  className="min-w-32"
                >
                  {uploading ? 'Uploading...' : 'Create Project'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default UploadProject;
