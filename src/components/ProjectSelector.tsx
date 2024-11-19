import React, { useState } from 'react';
import { FolderOpen, Plus, Database, Edit2, Trash2 } from 'lucide-react';
import { Project } from '../types';

interface ProjectSelectorProps {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (projectId: string) => void;
  onAddProject: (project: Omit<Project, 'id' | 'created' | 'updated'>) => void;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

export default function ProjectSelector({
  projects,
  selectedProjectId,
  onSelectProject,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
}: ProjectSelectorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    paths: ['']
  });

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const documentsCount = 150; // This would come from the actual database

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const project = projects.find(p => p.id === editingId);
      if (project) {
        onUpdateProject({
          ...project,
          ...formData,
        });
      }
      setEditingId(null);
    } else {
      onAddProject(formData);
      setIsAdding(false);
    }
    setFormData({ name: '', description: '', paths: [''] });
  };

  const startEditing = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      name: project.name,
      description: project.description || '',
      paths: project.paths,
    });
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <FolderOpen className="h-5 w-5 text-blue-400" />
          <div className="flex items-center gap-2">
            <select
              value={selectedProjectId}
              onChange={(e) => onSelectProject(e.target.value)}
              className="bg-gray-700 text-gray-200 rounded border border-gray-600 py-1 px-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => setIsAdding(true)}
              className="p-1 text-gray-400 hover:text-gray-300"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {selectedProject && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Database className="h-4 w-4" />
            <span>{documentsCount} documents</span>
          </div>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-gray-800 rounded-lg shadow-lg z-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-gray-700 text-gray-200 rounded border border-gray-600 p-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-gray-700 text-gray-200 rounded border border-gray-600 p-2"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Index Paths
              </label>
              {formData.paths.map((path, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={path}
                    onChange={(e) => {
                      const newPaths = [...formData.paths];
                      newPaths[index] = e.target.value;
                      setFormData(prev => ({ ...prev, paths: newPaths }));
                    }}
                    className="flex-1 bg-gray-700 text-gray-200 rounded border border-gray-600 p-2"
                    placeholder="/path/to/documents"
                  />
                  {formData.paths.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          paths: prev.paths.filter((_, i) => i !== index)
                        }));
                      }}
                      className="p-2 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    paths: [...prev.paths, '']
                  }));
                }}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                + Add Path
              </button>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setFormData({ name: '', description: '', paths: [''] });
                }}
                className="px-3 py-1 text-sm text-gray-400 hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editingId ? 'Update' : 'Create'} Project
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedProject && (
        <div className="p-4 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-300">Project Details</h3>
            <div className="flex gap-2">
              <button
                onClick={() => startEditing(selectedProject)}
                className="p-1 text-gray-400 hover:text-gray-300"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              {!selectedProject.isDefault && (
                <button
                  onClick={() => onDeleteProject(selectedProject.id)}
                  className="p-1 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          {selectedProject.description && (
            <p className="text-sm text-gray-400 mb-2">{selectedProject.description}</p>
          )}
          <div className="space-y-1">
            {selectedProject.paths.map((path, index) => (
              <div key={index} className="text-sm text-gray-400 flex items-center gap-2">
                <FolderOpen className="h-3 w-3" />
                {path}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}