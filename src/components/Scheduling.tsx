import React, { useState } from 'react';
import { Calendar, Clock, Plus, Trash2, Play, Pause } from 'lucide-react';
import { Schedule, Project } from '../types';

interface SchedulingProps {
  schedules: Schedule[];
  projects: Project[];
  onAddSchedule: (schedule: Omit<Schedule, 'id'>) => void;
  onUpdateSchedule: (schedule: Schedule) => void;
  onDeleteSchedule: (scheduleId: string) => void;
  onToggleSchedule: (scheduleId: string) => void;
}

export default function Scheduling({
  schedules,
  projects,
  onAddSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  onToggleSchedule,
}: SchedulingProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    name: '',
    paths: [''],
    cronExpression: '0 0 * * *', // Default to daily at midnight
    enabled: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSchedule(formData);
    setIsAdding(false);
    setFormData({
      projectId: '',
      name: '',
      paths: [''],
      cronExpression: '0 0 * * *',
      enabled: true,
    });
  };

  const addPath = () => {
    setFormData(prev => ({
      ...prev,
      paths: [...prev.paths, ''],
    }));
  };

  const removePath = (index: number) => {
    setFormData(prev => ({
      ...prev,
      paths: prev.paths.filter((_, i) => i !== index),
    }));
  };

  const updatePath = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      paths: prev.paths.map((path, i) => (i === index ? value : path)),
    }));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Scheduled Indexing
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="text-blue-400 hover:text-blue-300"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-700 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Project</label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
              className="w-full bg-gray-600 text-gray-200 rounded border border-gray-500 p-2"
              required
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Schedule Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-600 text-gray-200 rounded border border-gray-500 p-2"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Paths to Index</label>
            {formData.paths.map((path, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={path}
                  onChange={(e) => updatePath(index, e.target.value)}
                  className="flex-1 bg-gray-600 text-gray-200 rounded border border-gray-500 p-2"
                  placeholder="/path/to/folder"
                  required
                />
                <button
                  type="button"
                  onClick={() => removePath(index)}
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addPath}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              + Add another path
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Schedule (Cron Expression)</label>
            <input
              type="text"
              value={formData.cronExpression}
              onChange={(e) => setFormData(prev => ({ ...prev, cronExpression: e.target.value }))}
              className="w-full bg-gray-600 text-gray-200 rounded border border-gray-500 p-2"
              placeholder="0 0 * * *"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Format: minute hour day month weekday
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-2 text-gray-400 hover:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Schedule
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-gray-700 p-4 rounded-lg space-y-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-200">{schedule.name}</h3>
                <p className="text-sm text-gray-400">
                  Project: {projects.find(p => p.id === schedule.projectId)?.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleSchedule(schedule.id)}
                  className={`p-1 ${
                    schedule.enabled ? 'text-green-400 hover:text-green-300' : 'text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {schedule.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => onDeleteSchedule(schedule.id)}
                  className="p-1 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="h-4 w-4" />
              <span>{schedule.cronExpression}</span>
            </div>
            {schedule.lastRun && (
              <p className="text-xs text-gray-400">
                Last run: {new Date(schedule.lastRun).toLocaleString()}
              </p>
            )}
            {schedule.paths.map((path, index) => (
              <p key={index} className="text-sm text-gray-400">
                Path {index + 1}: {path}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}