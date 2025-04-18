
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ProcessingParameters } from '@/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProcessingParamsProps {
  params: ProcessingParameters;
  onChange: (params: ProcessingParameters) => void;
}

const ProcessingParams: React.FC<ProcessingParamsProps> = ({
  params,
  onChange,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleParamChange = <K extends keyof ProcessingParameters>(
    key: K,
    value: ProcessingParameters[K]
  ) => {
    onChange({
      ...params,
      [key]: value,
    });
  };

  return (
    <div className="bg-card border border-border rounded-md overflow-hidden">
      <div
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="font-medium">Processing Parameters</h3>
        <Button variant="ghost" size="icon">
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </Button>
      </div>
      
      {expanded && (
        <div className="p-4 pt-0 border-t border-border">
          <Separator className="my-4" />
          
          <div className="space-y-6">
            {/* Resolution */}
            <div className="space-y-2">
              <Label htmlFor="resolution">Resolution</Label>
              <Select
                value={params.resolution}
                onValueChange={(val) => handleParamChange('resolution', val as any)}
              >
                <SelectTrigger id="resolution">
                  <SelectValue placeholder="Select resolution" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Higher resolution means more detailed model but longer processing time.
              </p>
            </div>
            
            {/* Generate Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="generate-mesh">Generate Mesh</Label>
                <Switch
                  id="generate-mesh"
                  checked={params.generateMesh}
                  onCheckedChange={(checked) => handleParamChange('generateMesh', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="generate-orthophoto">Generate Orthophoto</Label>
                <Switch
                  id="generate-orthophoto"
                  checked={params.generateOrthophoto}
                  onCheckedChange={(checked) => handleParamChange('generateOrthophoto', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="generate-dsm-dtm">Generate DSM/DTM</Label>
                <Switch
                  id="generate-dsm-dtm"
                  checked={params.generateDsmDtm}
                  onCheckedChange={(checked) => handleParamChange('generateDsmDtm', checked)}
                />
              </div>
            </div>
            
            {/* Export Format */}
            <div className="space-y-2">
              <Label htmlFor="export-format">Export Format</Label>
              <Select
                value={params.exportFormat}
                onValueChange={(val) => handleParamChange('exportFormat', val)}
              >
                <SelectTrigger id="export-format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GLB">GLB (Default)</SelectItem>
                  <SelectItem value="OBJ">OBJ</SelectItem>
                  <SelectItem value="PLY">PLY</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Coordinate System */}
            <div className="space-y-2">
              <Label htmlFor="coordinate-system">Output Coordinate System (EPSG)</Label>
              <Input
                id="coordinate-system"
                value={params.outputCoordinateSystem}
                onChange={(e) => handleParamChange('outputCoordinateSystem', e.target.value)}
                placeholder="e.g. 25832"
              />
              <p className="text-xs text-muted-foreground">
                EPSG code for the output coordinate system.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessingParams;
