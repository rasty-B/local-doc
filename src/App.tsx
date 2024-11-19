import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import ChatHeader from './components/ChatHeader';
import FileUpload from './components/FileUpload';
import Settings from './components/Settings';
import ProfileManager from './components/ProfileManager';
import Connections from './components/Connections';
import Scheduling from './components/Scheduling';
import ProjectSelector from './components/ProjectSelector';
import { sendChatMessage } from './services/chat';
import { 
  Message, 
  Profile, 
  Model, 
  Settings as SettingsType, 
  Connection, 
  Project, 
  Schedule,
  EmbeddingModel 
} from './types';
import {
  SAMPLE_MODELS,
  EMBEDDING_MODELS,
  DEFAULT_PROFILES,
  DEFAULT_CONNECTIONS,
  SAMPLE_PROJECTS,
  SAMPLE_SCHEDULES
} from './constants';

function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState<'files' | 'settings' | 'profiles' | 'connections' | 'scheduling'>('files');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState(SAMPLE_PROJECTS[0].id);
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [profiles, setProfiles] = useState<Profile[]>(DEFAULT_PROFILES);
  const [selectedProfileId, setSelectedProfileId] = useState(DEFAULT_PROFILES[0].id);
  const [connections, setConnections] = useState<Connection[]>(DEFAULT_CONNECTIONS);
  const [schedules, setSchedules] = useState<Schedule[]>(SAMPLE_SCHEDULES);
  const [settings, setSettings] = useState<SettingsType>({
    selectedModel: SAMPLE_MODELS[0].id,
    selectedEmbeddingModel: EMBEDDING_MODELS[0].id,
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.9,
    streamResponse: true,
    responseFilter: 'Ensure responses are clear, concise, and well-formatted. Use markdown for code blocks and lists.'
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileSelect = (files: FileList) => {
    setSelectedFiles(prev => [...prev, ...Array.from(files)]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleModelChange = (modelId: string) => {
    setSettings(prev => ({ ...prev, selectedModel: modelId }));
  };

  const handleAddProfile = (profile: Omit<Profile, 'id'>) => {
    const newProfile: Profile = {
      ...profile,
      id: Math.random().toString(36).substr(2, 9)
    };
    setProfiles(prev => [...prev, newProfile]);
  };

  const handleUpdateProfile = (profile: Profile) => {
    setProfiles(prev => prev.map(p => p.id === profile.id ? profile : p));
  };

  const handleDeleteProfile = (profileId: string) => {
    setProfiles(prev => prev.filter(p => p.id !== profileId));
  };

  const handleAddConnection = (connection: Omit<Connection, 'id'>) => {
    const newConnection: Connection = {
      ...connection,
      id: Math.random().toString(36).substr(2, 9),
      isActive: true
    };
    setConnections(prev => [...prev, newConnection]);
  };

  const handleUpdateConnection = (connection: Connection) => {
    setConnections(prev => prev.map(c => c.id === connection.id ? connection : c));
  };

  const handleDeleteConnection = (connectionId: string) => {
    setConnections(prev => prev.filter(c => c.id !== connectionId));
  };

  const handleTestConnection = async (connectionId: string) => {
    const connection = connections.find(c => c.id === connectionId);
    if (!connection) return false;

    try {
      const response = await fetch(`${connection.config.baseUrl}/api/version`);
      return response.ok;
    } catch {
      return false;
    }
  };

  const handleAddProject = (project: Omit<Project, 'id' | 'created' | 'updated'>) => {
    const newProject: Project = {
      ...project,
      id: Math.random().toString(36).substr(2, 9),
      created: new Date(),
      updated: new Date()
    };
    setProjects(prev => [...prev, newProject]);
  };

  const handleUpdateProject = (project: Project) => {
    setProjects(prev => prev.map(p => p.id === project.id ? { ...project, updated: new Date() } : p));
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input,
      isBot: false,
      timestamp: new Date(),
      projectId: selectedProjectId
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const selectedProfile = profiles.find(p => p.id === selectedProfileId) || profiles[0];
      
      if (settings.streamResponse) {
        const stream = await sendChatMessage(input, {
          settings,
          profile: selectedProfile,
          projectId: selectedProjectId
        });

        if (stream) {
          const reader = stream.getReader();
          let responseText = '';

          const botMessage: Message = {
            text: '',
            isBot: true,
            timestamp: new Date(),
            projectId: selectedProjectId
          };

          setMessages(prev => [...prev, botMessage]);

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = new TextDecoder().decode(value);
            responseText += text;

            setMessages(prev => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1].text = responseText;
              return newMessages;
            });
          }
        }
      } else {
        const response = await sendChatMessage(input, {
          settings,
          profile: selectedProfile,
          projectId: selectedProjectId
        });

        const botMessage: Message = {
          text: response,
          isBot: true,
          timestamp: new Date(),
          projectId: selectedProjectId
        };

        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        text: 'Sorry, there was an error processing your message. Please try again.',
        isBot: true,
        timestamp: new Date(),
        projectId: selectedProjectId
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 transition duration-200 ease-in-out z-30 w-80 bg-gray-800 shadow-lg`}
      >
        <div className="flex flex-col h-full">
          {/* Tabs */}
          <div className="flex flex-wrap border-b border-gray-700">
            <button
              onClick={() => setActiveTab('files')}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === 'files'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Files
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === 'settings'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab('profiles')}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === 'profiles'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Profiles
            </button>
            <button
              onClick={() => setActiveTab('connections')}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === 'connections'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Connect
            </button>
            <button
              onClick={() => setActiveTab('scheduling')}
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === 'scheduling'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Schedule
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'files' && (
              <div className="p-4">
                <FileUpload
                  onFileSelect={handleFileSelect}
                  onFolderSelect={(path) => console.log('Folder selected:', path)}
                  selectedFiles={selectedFiles}
                  onRemoveFile={handleRemoveFile}
                />
              </div>
            )}
            {activeTab === 'settings' && (
              <Settings
                settings={settings}
                models={SAMPLE_MODELS}
                embeddingModels={EMBEDDING_MODELS}
                onSettingsChange={setSettings}
              />
            )}
            {activeTab === 'profiles' && (
              <div className="p-4">
                <ProfileManager
                  profiles={profiles}
                  selectedProfileId={selectedProfileId}
                  onSelectProfile={setSelectedProfileId}
                  onAddProfile={handleAddProfile}
                  onUpdateProfile={handleUpdateProfile}
                  onDeleteProfile={handleDeleteProfile}
                />
              </div>
            )}
            {activeTab === 'connections' && (
              <Connections
                connections={connections}
                onAddConnection={handleAddConnection}
                onUpdateConnection={handleUpdateConnection}
                onDeleteConnection={handleDeleteConnection}
                onTestConnection={handleTestConnection}
              />
            )}
            {activeTab === 'scheduling' && (
              <Scheduling
                schedules={schedules}
                projects={projects}
                onAddSchedule={(schedule) => setSchedules(prev => [...prev, { ...schedule, id: Math.random().toString(36).substr(2, 9) }])}
                onUpdateSchedule={(schedule) => setSchedules(prev => prev.map(s => s.id === schedule.id ? schedule : s))}
                onDeleteSchedule={(id) => setSchedules(prev => prev.filter(s => s.id !== id))}
                onToggleSchedule={(id) => setSchedules(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s))}
              />
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <ChatHeader
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          selectedModel={settings.selectedModel}
          selectedProfileId={selectedProfileId}
          models={SAMPLE_MODELS}
          profiles={profiles}
          onModelChange={handleModelChange}
          onProfileChange={setSelectedProfileId}
        />

        <ProjectSelector
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
          onAddProject={handleAddProject}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
        />

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.text}
              isBot={message.isBot}
              timestamp={message.timestamp}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;