import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Link, Server } from 'lucide-react';
import { Connection } from '../types';

interface ConnectionsProps {
  connections: Connection[];
  onAddConnection: (connection: Omit<Connection, 'id'>) => void;
  onUpdateConnection: (connection: Connection) => void;
  onDeleteConnection: (connectionId: string) => void;
  onTestConnection: (connectionId: string) => Promise<boolean>;
}

export default function Connections({
  connections,
  onAddConnection,
  onUpdateConnection,
  onDeleteConnection,
  onTestConnection,
}: ConnectionsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'ollama' as const,
    config: {
      apiKey: '',
      baseUrl: '',
      models: [],
    },
  });
  const [testStatus, setTestStatus] = useState<Record<string, 'success' | 'error' | 'testing' | null>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdateConnection({ id: editingId, ...formData, isActive: true });
      setEditingId(null);
    } else {
      onAddConnection({ ...formData, isActive: true });
      setIsAdding(false);
    }
    setFormData({
      name: '',
      type: 'ollama',
      config: {
        apiKey: '',
        baseUrl: '',
        models: [],
      },
    });
  };

  const handleTest = async (connectionId: string) => {
    setTestStatus(prev => ({ ...prev, [connectionId]: 'testing' }));
    try {
      const success = await onTestConnection(connectionId);
      setTestStatus(prev => ({ ...prev, [connectionId]: success ? 'success' : 'error' }));
    } catch {
      setTestStatus(prev => ({ ...prev, [connectionId]: 'error' }));
    }
  };

  const startEditing = (connection: Connection) => {
    setEditingId(connection.id);
    setFormData({
      name: connection.name,
      type: connection.type,
      config: connection.config,
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
          <Link className="h-5 w-5" />
          Connections
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="text-blue-400 hover:text-blue-300"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-700 p-4 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-gray-600 text-gray-200 rounded border border-gray-500 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="My Connection"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Connection['type'] }))}
              className="w-full bg-gray-600 text-gray-200 rounded border border-gray-500 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="ollama">Ollama</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
            </select>
          </div>

          {formData.type !== 'ollama' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
              <input
                type="password"
                value={formData.config.apiKey}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  config: { ...prev.config, apiKey: e.target.value }
                }))}
                className="w-full bg-gray-600 text-gray-200 rounded border border-gray-500 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="sk-..."
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Base URL</label>
            <input
              type="text"
              value={formData.config.baseUrl}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                config: { ...prev.config, baseUrl: e.target.value }
              }))}
              className="w-full bg-gray-600 text-gray-200 rounded border border-gray-500 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder={formData.type === 'ollama' ? 'http://localhost:11434' : ''}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setFormData({
                  name: '',
                  type: 'ollama',
                  config: { apiKey: '', baseUrl: '', models: [] },
                });
              }}
              className="px-3 py-2 text-gray-400 hover:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingId ? 'Update' : 'Add'} Connection
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {connections.map((connection) => (
          <div
            key={connection.id}
            className="bg-gray-700 p-4 rounded-lg space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className={`h-5 w-5 ${connection.isActive ? 'text-green-400' : 'text-gray-400'}`} />
                <span className="font-medium text-gray-200">{connection.name}</span>
                <span className="text-sm text-gray-400">({connection.type})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTest(connection.id)}
                  className={`px-3 py-1 rounded text-sm ${
                    testStatus[connection.id] === 'success'
                      ? 'bg-green-600 text-white'
                      : testStatus[connection.id] === 'error'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-600 text-gray-200'
                  }`}
                >
                  {testStatus[connection.id] === 'testing' ? 'Testing...' : 'Test'}
                </button>
                <button
                  onClick={() => startEditing(connection)}
                  className="p-1 text-gray-400 hover:text-gray-300"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteConnection(connection.id)}
                  className="p-1 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {connection.config.baseUrl && (
              <div className="text-sm text-gray-400">
                URL: {connection.config.baseUrl}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}