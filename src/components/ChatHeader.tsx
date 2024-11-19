import React from 'react';
import { Menu, Brain, User } from 'lucide-react';
import { Model, Profile } from '../types';

interface ChatHeaderProps {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  selectedModel: string;
  selectedProfileId: string;
  models: Model[];
  profiles: Profile[];
  onModelChange: (modelId: string) => void;
  onProfileChange: (profileId: string) => void;
}

export default function ChatHeader({
  showSidebar,
  setShowSidebar,
  selectedModel,
  selectedProfileId,
  models,
  profiles,
  onModelChange,
  onProfileChange,
}: ChatHeaderProps) {
  return (
    <header className="bg-gray-800 shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden text-gray-400 hover:text-gray-300"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-200">Personal AI Assistant</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-400" />
            <select
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
              className="bg-gray-700 text-gray-200 rounded border border-gray-600 py-1 px-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-green-400" />
            <select
              value={selectedProfileId}
              onChange={(e) => onProfileChange(e.target.value)}
              className="bg-gray-700 text-gray-200 rounded border border-gray-600 py-1 px-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}