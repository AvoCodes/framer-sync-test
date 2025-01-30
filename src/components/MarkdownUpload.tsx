import React, { useState, useCallback } from "react";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MarkdownUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    const validTypes = [".md", ".markdown", "text/markdown"];
    const isValidType = validTypes.some(type => 
      file.name.toLowerCase().endsWith(type) || file.type === type
    );
    
    if (!isValidType) {
      toast({
        title: "Invalid file type",
        description: `${file.name} is not a markdown file. Please upload only .md or .markdown files.`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const processFiles = (files: FileList | null) => {
    if (!files) return;
    
    const validFiles: File[] = [];
    Array.from(files).forEach(file => {
      if (validateFile(file)) {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      toast({
        title: "Files added",
        description: `${validFiles.length} markdown ${validFiles.length === 1 ? 'file' : 'files'} selected.`,
      });
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      // Simulated upload delay - replace with actual upload logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Success!",
        description: `${selectedFiles.length} ${selectedFiles.length === 1 ? 'file has' : 'files have'} been uploaded successfully.`,
      });
      setSelectedFiles([]);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Upload Markdown Files</h1>
          <p className="text-gray-600">Drag and drop your markdown files or folder here</p>
        </div>
        
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200",
            isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
            "cursor-pointer"
          )}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            type="file"
            id="file-input"
            className="hidden"
            accept=".md,.markdown"
            multiple
            webkitdirectory={true}
            onChange={handleFileSelect}
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-sm text-gray-600">
            Drop your markdown files or folder here, or click to select
          </p>
        </div>

        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <div className="bg-white rounded-lg shadow p-4 max-h-60 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600 truncate">{file.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <Button
              className="w-full"
              onClick={handleUpload}
              disabled={isUploading}
            >
              {isUploading 
                ? `Uploading ${selectedFiles.length} ${selectedFiles.length === 1 ? 'file' : 'files'}...` 
                : `Upload ${selectedFiles.length} ${selectedFiles.length === 1 ? 'file' : 'files'}`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownUpload;