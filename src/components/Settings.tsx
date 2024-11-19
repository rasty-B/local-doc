import React from 'react';
import { Settings as SettingsIcon, Sliders, Zap, Database, Filter } from 'lucide-react';
import { Settings as SettingsType, Model, EmbeddingModel } from '../types';

interface SettingsProps {
  settings: SettingsType;
  models: Model[];
  embeddingModels: EmbeddingModel[];
  onSettingsChange: (settings: SettingsType) => void;
}

export default function Settings({ settings, models, embeddingModels, onSettingsChange }: SettingsProps) {
  return (
    <div className="space-y-6 p-6 bg-gray-800 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" />
          Settings
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
          <select
            value={settings.selectedModel}
            onChange={(e) => onSettingsChange({ ...settings, selectedModel: e.target.value })}
            className="w-full bg-gray-700 text-gray-200 rounded border border-gray-600 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.parameters}, {model.quantization})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Database className="h-4 w-4" />
            Embedding Model
          </label>
          <select
            value={settings.selectedEmbeddingModel}
            onChange={(e) => onSettingsChange({ ...settings, selectedEmbeddingModel: e.target.value })}
            className="w-full bg-gray-700 text-gray-200 rounded border border-gray-600 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {embeddingModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.dimensions}d)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Response Filter
          </label>
          <textarea
            value={settings.responseFilter}
            onChange={(e) => onSettingsChange({ ...settings, responseFilter: e.target.value })}
            placeholder="Add instructions to filter or modify the model's responses..."
            className="w-full bg-gray-700 text-gray-200 rounded border border-gray-600 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-24"
          />
          <p className="text-xs text-gray-400 mt-1">
            These instructions will be applied to modify the model's output before displaying.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            Temperature
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.temperature}
            onChange={(e) => onSettingsChange({ ...settings, temperature: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="text-gray-400 text-sm mt-1">{settings.temperature}</div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Max Tokens</label>
          <input
            type="number"
            min="1"
            max="4096"
            value={settings.maxTokens}
            onChange={(e) => onSettingsChange({ ...settings, maxTokens: parseInt(e.target.value) })}
            className="w-full bg-gray-700 text-gray-200 rounded border border-gray-600 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Top P</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.topP}
            onChange={(e) => onSettingsChange({ ...settings, topP: parseFloat(e.target.value) })}
            className="w-full"
          />
          <div className="text-gray-400 text-sm mt-1">{settings.topP}</div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Stream Response
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.streamResponse}
              onChange={(e) => onSettingsChange({ ...settings, streamResponse: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
}