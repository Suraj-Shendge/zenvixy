"use client";

import { useCallback, useState } from "react";
import { Upload, File, X, AlertCircle } from "lucide-react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: string;
  multiple?: boolean;
}

export default function UploadZone({
  onFileSelect,
  accept,
  maxSize = "50MB",
  multiple = false,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    setError(null);
    
    // Size validation (simplified)
    const maxBytes = parseSize(maxSize);
    if (file.size > maxBytes) {
      setError(`File size exceeds ${maxSize} limit`);
      return false;
    }
    
    return true;
  };

  const parseSize = (size: string): number => {
    const units = { B: 1, KB: 1024, MB: 1024 * 1024, GB: 1024 * 1024 * 1024 };
    const match = size.match(/^(\d+)\s*(B|KB|MB|GB)$/i);
    if (!match) return Infinity;
    return parseInt(match[1]) * units[match[2].toUpperCase() as keyof typeof units];
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="w-full">
      {!selectedFile ? (
        <label
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center w-full h-64 
            border-2 border-dashed rounded-2xl cursor-pointer
            transition-all duration-200
            ${isDragging 
              ? "border-accent bg-accent/5" 
              : "border-border bg-card hover:border-accent/50 hover:bg-secondary"
            }
            ${error ? "border-warning" : ""}
          `}
        >
          <input
            type="file"
            className="hidden"
            onChange={handleChange}
            accept={accept}
            multiple={multiple}
          />
          
          <div className={`
            w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors
            ${isDragging ? "bg-accent/10" : "bg-secondary"}
          `}>
            <Upload className={`w-8 h-8 ${isDragging ? "text-accent" : "text-tertiary"}`} />
          </div>
          
          <p className="text-lg font-medium text-foreground mb-1">
            {isDragging ? "Drop your file here" : "Drag & drop or click to upload"}
          </p>
          
          <p className="text-sm text-tertiary">
            Max file size: {maxSize}
          </p>
          
          {error && (
            <div className="absolute bottom-4 flex items-center gap-2 text-warning text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </label>
      ) : (
        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <File className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-tertiary">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={clearFile}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-tertiary" />
          </button>
        </div>
      )}
    </div>
  );
}
