
import React, { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  className?: string;
}

const DropZone: React.FC<DropZoneProps> = ({
  onFilesAdded,
  accept = 'image/*,.glb',
  multiple = true,
  maxFiles = 50,
  maxSize = 50, // 50MB
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const processFiles = useCallback(
    (inputFiles: FileList | null) => {
      if (!inputFiles) return;
      
      setError(null);
      
      // Convert FileList to Array
      const filesArray = Array.from(inputFiles);
      
      // Check max files
      if (multiple && filesArray.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }
      
      // Check file sizes
      const oversizedFiles = filesArray.filter(file => file.size > maxSize * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        setError(`Some files exceed the maximum size of ${maxSize}MB`);
        return;
      }
      
      // Update files state
      const updatedFiles = multiple ? [...files, ...filesArray] : [...filesArray];
      setFiles(updatedFiles);
      onFilesAdded(updatedFiles);
    },
    [files, maxFiles, maxSize, multiple, onFilesAdded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(e.target.files);
    },
    [processFiles]
  );

  const removeFile = useCallback(
    (indexToRemove: number) => {
      const updatedFiles = files.filter((_, index) => index !== indexToRemove);
      setFiles(updatedFiles);
      onFilesAdded(updatedFiles);
    },
    [files, onFilesAdded]
  );

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'dropzone',
          'flex flex-col items-center justify-center p-6 transition-all cursor-pointer',
          isDragging && 'active',
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
        />
        <label htmlFor="file-upload" className="cursor-pointer w-full h-full">
          <div className="flex flex-col items-center justify-center py-6">
            <Upload
              size={28}
              className={cn(
                'mb-2 text-muted-foreground',
                isDragging && 'text-roof-400'
              )}
            />
            <p className="text-center mb-2">
              {isDragging ? (
                <span className="text-roof-400 font-medium">Drop files here</span>
              ) : (
                <span>Drag &amp; drop files here</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground mb-4 text-center">
              or click to browse
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Select Files
            </Button>
          </div>
        </label>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="border border-border rounded-md overflow-hidden">
          <div className="bg-card p-3 border-b border-border">
            <h3 className="font-medium text-sm">Selected Files ({files.length})</h3>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 hover:bg-muted/30"
              >
                <div className="flex items-center space-x-3">
                  <File size={16} className="text-muted-foreground" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => removeFile(index)}
                >
                  <X size={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropZone;
