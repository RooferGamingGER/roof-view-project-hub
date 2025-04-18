
import React, { useEffect, useRef } from 'react';

interface GLBViewerProps {
  modelUrl: string;
  className?: string;
}

const GLBViewer: React.FC<GLBViewerProps> = ({ modelUrl, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // For now, we're mocking the GLB viewer with a placeholder
    // In a real implementation, we would integrate the provided GLB viewer code here
    console.log(`Rendering GLB model from URL: ${modelUrl}`);

    // When integrating with the actual viewer from drohnenglb.de, 
    // we would either:
    // 1. Use an iframe to embed the viewer (as a temporary solution)
    // 2. Properly integrate the Three.js code from the repository

    return () => {
      // Cleanup code would go here
    };
  }, [modelUrl]);

  return (
    <div ref={containerRef} className={`glb-viewer ${className}`}>
      {/* This is a mock viewer - in a real app we would integrate the actual Three.js GLB viewer */}
      <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center">
        <div className="glass-card p-6 rounded-lg text-center">
          <h3 className="text-xl font-medium mb-2">3D Model Viewer</h3>
          <p className="text-sm text-muted-foreground mb-4">
            GLB Model would render here using the Three.js viewer
          </p>
          <div className="text-xs text-muted-foreground">Model URL: {modelUrl}</div>
        </div>
      </div>
      
      {/* Iframe approach (would be replaced with direct integration) */}
      {/* <iframe
        ref={iframeRef}
        src={`https://www.drohnenglb.de/?model=${encodeURIComponent(modelUrl)}`}
        title="GLB Viewer"
        className="w-full h-full border-0"
      /> */}
    </div>
  );
};

export default GLBViewer;
