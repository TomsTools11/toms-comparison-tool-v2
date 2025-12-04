import React from 'react';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  return (
    <div className="bg-bg-primary min-h-screen text-text-primary antialiased font-body selection:bg-brand-blue/30 selection:text-white">
      <Dashboard />
    </div>
  );
};

export default App;