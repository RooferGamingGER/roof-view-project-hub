
import React, { useState } from 'react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Navbar from '@/components/Layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const AdminSettings = () => {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState([
    { id: '1', name: 'Primary Node', url: 'http://nodeodm.example.com:3000', isActive: true },
    { id: '2', name: 'Backup Node', url: 'http://backup-nodeodm.example.com:3000', isActive: false },
  ]);
  
  const [defaultParams, setDefaultParams] = useState({
    resolution: 'medium',
    generateMesh: true,
    generateOrthophoto: true,
    generateDsmDtm: false,
    exportFormat: 'GLB',
    outputCoordinateSystem: '25832',
  });

  const handleAddNode = () => {
    const newNode = {
      id: `${nodes.length + 1}`,
      name: 'New Node',
      url: 'http://',
      isActive: false,
    };
    setNodes([...nodes, newNode]);
  };

  const handleRemoveNode = (id: string) => {
    setNodes(nodes.filter(node => node.id !== id));
  };

  const handleNodeChange = (id: string, field: string, value: string | boolean) => {
    setNodes(nodes.map(node => 
      node.id === id ? { ...node, [field]: value } : node
    ));
  };

  const handleParamChange = (field: string, value: any) => {
    setDefaultParams({
      ...defaultParams,
      [field]: value,
    });
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to API/backend
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully saved.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>

          <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>
          
          <div className="space-y-8">
            {/* Default Processing Parameters */}
            <Card>
              <CardHeader>
                <CardTitle>Default Processing Parameters</CardTitle>
                <CardDescription>
                  Set default values for new projects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="default-resolution">Default Resolution</Label>
                    <Select
                      value={defaultParams.resolution}
                      onValueChange={(val) => handleParamChange('resolution', val)}
                    >
                      <SelectTrigger id="default-resolution">
                        <SelectValue placeholder="Select resolution" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="default-export">Default Export Format</Label>
                    <Select
                      value={defaultParams.exportFormat}
                      onValueChange={(val) => handleParamChange('exportFormat', val)}
                    >
                      <SelectTrigger id="default-export">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GLB">GLB</SelectItem>
                        <SelectItem value="OBJ">OBJ</SelectItem>
                        <SelectItem value="PLY">PLY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="default-mesh">Generate Mesh by Default</Label>
                    <Switch
                      id="default-mesh"
                      checked={defaultParams.generateMesh}
                      onCheckedChange={(checked) => handleParamChange('generateMesh', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="default-orthophoto">Generate Orthophoto by Default</Label>
                    <Switch
                      id="default-orthophoto"
                      checked={defaultParams.generateOrthophoto}
                      onCheckedChange={(checked) => handleParamChange('generateOrthophoto', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="default-dsm-dtm">Generate DSM/DTM by Default</Label>
                    <Switch
                      id="default-dsm-dtm"
                      checked={defaultParams.generateDsmDtm}
                      onCheckedChange={(checked) => handleParamChange('generateDsmDtm', checked)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="default-epsg">Default Output Coordinate System (EPSG)</Label>
                  <Input
                    id="default-epsg"
                    value={defaultParams.outputCoordinateSystem}
                    onChange={(e) => handleParamChange('outputCoordinateSystem', e.target.value)}
                    placeholder="e.g. 25832"
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* NodeODM Connections */}
            <Card>
              <CardHeader>
                <CardTitle>NodeODM Connections</CardTitle>
                <CardDescription>
                  Manage connections to NodeODM processing servers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {nodes.map((node, index) => (
                  <div key={node.id} className="space-y-4">
                    {index > 0 && <Separator />}
                    <div className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <Label htmlFor={`node-name-${node.id}`}>Node Name</Label>
                          <Input
                            id={`node-name-${node.id}`}
                            value={node.name}
                            onChange={(e) => handleNodeChange(node.id, 'name', e.target.value)}
                          />
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveNode(node.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      
                      <div className="mt-4 space-y-1">
                        <Label htmlFor={`node-url-${node.id}`}>Node URL</Label>
                        <Input
                          id={`node-url-${node.id}`}
                          value={node.url}
                          onChange={(e) => handleNodeChange(node.id, 'url', e.target.value)}
                        />
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <Label htmlFor={`node-active-${node.id}`}>Active</Label>
                        <Switch
                          id={`node-active-${node.id}`}
                          checked={node.isActive}
                          onCheckedChange={(checked) => handleNodeChange(node.id, 'isActive', checked)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  onClick={handleAddNode}
                  className="w-full"
                >
                  <Plus size={16} className="mr-2" />
                  Add Node
                </Button>
              </CardContent>
            </Card>
            
            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} className="min-w-32">
                <Save size={16} className="mr-2" />
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
