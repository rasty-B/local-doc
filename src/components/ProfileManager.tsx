import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { Profile } from '../types';

interface ProfileManagerProps {
  profiles: Profile[];
  selectedProfileId: string | null;
  onSelectProfile: (profileId: string | null) => void;
  onAddProfile: (profile: Omit<Profile, 'id'>) => void;
  onUpdateProfile: (profile: Profile) => void;
  onDeleteProfile: (profileId: string) => void;
}

export default function ProfileManager({
  profiles,
  selectedProfileId,
  onSelectProfile,
  onAddProfile,
  onUpdateProfile,
  onDeleteProfile,
}: ProfileManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProfile, setNewProfile] = useState(false);
  const [formData, setFormData] = useState({ name: '', prompt: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdateProfile({ id: editingId, ...formData });
      setEditingId(null);
    } else {
      onAddProfile(formData);
      setNewProfile(false);
    }
    setFormData({ name: '', prompt: '' });
  };

  const startEditing = (profile: Profile) => {
    setEditingId(profile.id);
    setFormData({ name: profile.name, prompt: profile.prompt });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-200">Profiles</h2>
        <button
          onClick={() => setNewProfile(true)}
          className="text-blue-400 hover:text-blue-300"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {(newProfile || editingId) && (
        <form onSubmit={handleSubmit} className="space-y-3 bg-gray-800 p-4 rounded-lg">
          <input
            type="text"
            placeholder="Profile Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <textarea
            placeholder="Enter system prompt..."
            value={formData.prompt}
            onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
            className="w-full p-2 bg-gray-700 text-gray-200 rounded border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-24"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setNewProfile(false);
                setEditingId(null);
                setFormData({ name: '', prompt: '' });
              }}
              className="p-2 text-gray-400 hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              type="submit"
              className="p-2 text-green-400 hover:text-green-300"
            >
              <Check className="h-5 w-5" />
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
              selectedProfileId === profile.id
                ? 'bg-blue-900 text-blue-100'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            onClick={() => onSelectProfile(profile.id)}
          >
            <div className="flex-1">
              <p className="font-medium">{profile.name}</p>
              {profile.isDefault && (
                <span className="text-xs text-gray-400">Default Profile</span>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startEditing(profile);
                }}
                className="p-1 text-gray-400 hover:text-gray-300"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              {!profile.isDefault && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProfile(profile.id);
                  }}
                  className="p-1 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}