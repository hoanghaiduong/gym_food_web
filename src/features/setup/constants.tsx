import React from 'react';
import { 
  Globe, 
  Database, 
  HardDrive, 
  Layers, 
  UserPlus, 
  Cpu, 
  Settings 
} from 'lucide-react';

export const STEPS = [
  { 
    id: 1, 
    title: 'Backend & Network', 
    description: 'Configure API Gateway & WebSocket', 
    icon: <Globe size={20} /> 
  },
  { 
    id: 2, 
    title: 'Database Connection', 
    description: 'Primary Data Storage', 
    icon: <Database size={20} /> 
  },
  { 
    id: 3, 
    title: 'Vector Search (RAG)', 
    description: 'Knowledge Base Indexing', 
    icon: <HardDrive size={20} /> 
  },
  { 
    id: 4, 
    title: 'System Bootstrapping', 
    description: 'Schema Migration & Seeds', 
    icon: <Layers size={20} /> 
  },
  { 
    id: 5, 
    title: 'Admin Account', 
    description: 'Create Root User', 
    icon: <UserPlus size={20} /> 
  },
  { 
    id: 6, 
    title: 'LLM Configuration', 
    description: 'AI Brain & Model Settings', 
    icon: <Cpu size={20} /> 
  },
  { 
    id: 7, 
    title: 'General Site Info', 
    description: 'Bot Identity & Localization', 
    icon: <Settings size={20} /> 
  },
];