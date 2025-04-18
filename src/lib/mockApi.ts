
import { Project, NewProject, ProjectStatus } from '../types';

// Mock delay to simulate network requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock projects data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Residential Home 2-Story',
    address: '123 Main St, Springfield',
    thumbnail: '/placeholder.svg',
    status: 'done',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-16'),
    hasOrthophoto: true,
    results: {
      glbUrl: 'https://cdn.pixabay.com/photo/2022/10/17/150409/3d-model-7528496_960_720.jpg',
      zipUrl: '/mock/project1.zip',
      objUrl: '/mock/project1.obj',
      tifUrl: '/mock/project1.tif',
    }
  },
  {
    id: '2',
    name: 'Commercial Building Flat Roof',
    address: '456 Business Ave, Shelbyville',
    thumbnail: '/placeholder.svg',
    status: 'processing',
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2023-02-01'),
    processingParams: {
      resolution: 'high',
      generateMesh: true,
      generateOrthophoto: true,
      generateDsmDtm: false,
      exportFormat: 'GLB',
      outputCoordinateSystem: '25832',
    }
  },
  {
    id: '3',
    name: 'Apartment Complex',
    address: '789 Residential Blvd, Capitol City',
    thumbnail: '/placeholder.svg',
    status: 'pending',
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-02-15'),
  },
  {
    id: '4',
    name: 'Industrial Warehouse',
    address: '101 Factory Rd, Industry Park',
    thumbnail: '/placeholder.svg',
    status: 'error',
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-01-06'),
    notes: 'Processing failed due to corrupted input files'
  }
];

// Mock API functions
export const api = {
  // Get all projects
  getProjects: async (): Promise<Project[]> => {
    await delay(800);
    return [...mockProjects];
  },

  // Get project by ID
  getProject: async (id: string): Promise<Project | null> => {
    await delay(500);
    const project = mockProjects.find(p => p.id === id);
    return project || null;
  },

  // Create new project
  createProject: async (projectData: NewProject): Promise<Project> => {
    await delay(1200);
    
    // Create a new mock project
    const newProject: Project = {
      id: `${mockProjects.length + 1}`,
      name: projectData.name,
      address: projectData.address,
      thumbnail: '/placeholder.svg',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      processingParams: projectData.processingParams,
    };

    // In a real app we'd send the files to the backend
    console.log(`Uploaded ${projectData.files.length} files`);
    
    // Add to mock projects
    mockProjects.push(newProject);
    
    // After creation, simulate processing pipeline
    simulateProcessingPipeline(newProject.id);
    
    return newProject;
  },
};

// Simulate a processing pipeline for demonstration
async function simulateProcessingPipeline(projectId: string) {
  // Find project in mock data
  const project = mockProjects.find(p => p.id === projectId);
  if (!project) return;

  // Update to processing status
  await delay(3000); // Wait 3 seconds before starting processing
  project.status = 'processing';
  project.updatedAt = new Date();
  
  // Simulate processing time (success or error)
  const processingTime = Math.random() * 10000 + 5000; // 5-15 seconds
  await delay(processingTime);
  
  // 10% chance of error for demo purposes
  if (Math.random() < 0.1) {
    project.status = 'error';
    project.notes = 'Processing failed due to server error';
  } else {
    project.status = 'done';
    project.hasOrthophoto = true;
    project.results = {
      glbUrl: '/mock/project.glb',
      zipUrl: '/mock/project.zip',
      objUrl: '/mock/project.obj',
      tifUrl: '/mock/project.tif',
    };
  }
  
  project.updatedAt = new Date();
}
