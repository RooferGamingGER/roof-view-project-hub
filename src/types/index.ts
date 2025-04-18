
export type ProjectStatus = 'pending' | 'processing' | 'done' | 'error';

export type Resolution = 'high' | 'medium' | 'low';

export interface ProcessingParameters {
  resolution: Resolution;
  generateMesh: boolean;
  generateOrthophoto: boolean;
  generateDsmDtm: boolean;
  exportFormat: string;
  outputCoordinateSystem: string;
}

export interface Project {
  id: string;
  name: string;
  address?: string;
  thumbnail: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  processingParams?: ProcessingParameters;
  notes?: string;
  hasOrthophoto?: boolean;
  results?: {
    glbUrl?: string;
    zipUrl?: string;
    objUrl?: string;
    tifUrl?: string;
  };
}

export interface NewProject {
  name: string;
  address?: string;
  files: File[];
  processingParams: ProcessingParameters;
}
