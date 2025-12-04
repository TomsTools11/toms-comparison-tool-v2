import { ComparisonItem } from './types';

export const INITIAL_ITEMS: ComparisonItem[] = [
  {
    id: 'item-1',
    name: 'Nexus Alpha',
    description: 'Enterprise-grade solution with robust security.',
    badge: { type: 'leader', text: 'Market Leader' },
    category: 'enterprise',
    metrics: {
      performance: 4.8,
      reliability: 4.9,
      usability: 3.5,
      support: 5.0,
      pricing: 2.5
    },
    features: {
      cloudSync: true,
      apiAccess: true,
      sso: true,
      mobileApp: 'partial',
      aiAssistant: true
    },
    highlights: ['SOC2 Certified', '24/7 Dedicated Support', 'Unlimited API Calls'],
    cons: ['Steep learning curve', 'Expensive for small teams'],
    idealFor: 'Fortune 500 companies requiring maximum compliance.',
    accentColor: '#407EC9'
  },
  {
    id: 'item-2',
    name: 'SwiftStream',
    description: 'Lightweight, fast, and developer-friendly.',
    badge: { type: 'popular', text: 'Dev Choice' },
    category: 'startup',
    metrics: {
      performance: 5.0,
      reliability: 4.2,
      usability: 4.8,
      support: 3.8,
      pricing: 4.5
    },
    features: {
      cloudSync: true,
      apiAccess: true,
      sso: false,
      mobileApp: true,
      aiAssistant: false
    },
    highlights: ['Zero Config', 'Blazing Fast', 'Great Documentation'],
    cons: ['Limited enterprise controls', 'No SLA on free tier'],
    idealFor: 'Startups and individual developers.',
    accentColor: '#D9730D'
  },
  {
    id: 'item-3',
    name: 'CoreBase',
    description: 'Balanced features for growing businesses.',
    badge: { type: 'rising', text: 'Rising Star' },
    category: 'sme',
    metrics: {
      performance: 4.0,
      reliability: 4.5,
      usability: 4.2,
      support: 4.0,
      pricing: 4.0
    },
    features: {
      cloudSync: true,
      apiAccess: 'partial',
      sso: true,
      mobileApp: true,
      aiAssistant: 'partial'
    },
    highlights: ['Great Value', 'Easy Onboarding', 'Active Community'],
    cons: ['Reporting is basic', 'API rate limits'],
    idealFor: 'SMEs looking for a balance of power and ease.',
    accentColor: '#448361'
  },
  {
    id: 'item-4',
    name: 'Zenith Pro',
    description: 'AI-driven analytics platform.',
    category: 'enterprise',
    metrics: {
      performance: 4.2,
      reliability: 4.0,
      usability: 4.5,
      support: 4.2,
      pricing: 3.0
    },
    features: {
      cloudSync: true,
      apiAccess: true,
      sso: true,
      mobileApp: false,
      aiAssistant: true
    },
    highlights: ['Predictive Insights', 'Automated Workflows'],
    cons: ['Complex setup', 'Requires data training'],
    idealFor: 'Data-heavy organizations.',
    accentColor: '#8B5CF6'
  }
];

export const METRIC_LABELS: Record<string, string> = {
  performance: 'Performance',
  reliability: 'Reliability',
  usability: 'Usability',
  support: 'Support',
  pricing: 'Value for Money'
};

export const FEATURE_LABELS: Record<string, string> = {
  cloudSync: 'Cloud Sync',
  apiAccess: 'API Access',
  sso: 'SSO / SAML',
  mobileApp: 'Mobile App',
  aiAssistant: 'AI Assistant'
};
