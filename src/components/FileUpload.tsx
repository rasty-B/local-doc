import React, { useCallback, useRef } from 'react';
import { Upload, Folder, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (files: FileList) => void;
  onFolderSelect: (path: string) => void;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
}

export default function FileUpload({ 
  onFileSelect, 
  onFolderSelect,
  selectedFiles, 
  onRemoveFile 
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Handle both files and folders
    const items = Array.from(e.dataTransfer.items);
    
    items.forEach((item) => {
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry();
        if (entry?.isDirectory) {
          handleFolderEntry(entry);
        } else {
          const file = item.getAsFile();
          if (file) onFileSelect(new DataTransfer().files);
        }
      }
    });
  }, [onFileSelect, onFolderSelect]);

  const handleFolderEntry = async (entry: any) => {
    const files: File[] = [];
    
    async function readEntries(dirEntry: any): Promise<void> {
      const reader = dirEntry.createReader();
      const entries: any[] = await new Promise((resolve) => {
        reader.readEntries(resolve);
      });
      
      for (const entry of entries) {
        if (entry.isFile) {
          const file = await new Promise<File>((resolve) => {
            entry.file(resolve);
          });
          files.push(file);
        } else if (entry.isDirectory) {
          await readEntries(entry);
        }
      }
    }
    
    await readEntries(entry);
    onFolderSelect(entry.fullPath);
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Upload className="h-4 w-4" />
          Upload Files
        </button>
        <button
          onClick={() => folderInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Folder className="h-4 w-4" />
          Upload Folder
        </button>
      </div>

      <div
        className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-400">
          Drag and drop files or folders here
        </p>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && onFileSelect(e.target.files)}
      />
      <input
        ref={folderInputRef}
        type="file"
        webkitdirectory=""
        directory=""
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            const path = e.target.files[0].webkitRelativePath.split('/')[0];
            onFolderSelect(path);
          }
        }}
      />
      
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-700 rounded"
            >
              <span className="text-sm text-gray-300 truncate">
                {file.webkitRelativePath || file.name}
              </span>
              <button
                onClick={() => onRemoveFile(index)}
                className="text-red-400 hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}