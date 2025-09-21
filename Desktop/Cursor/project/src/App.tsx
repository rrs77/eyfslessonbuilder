import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ClassProvider } from './contexts/ClassContext';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { LoginForm } from './components/LoginForm';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Footer } from './components/Footer';
import { useAuth } from './hooks/useAuth';
import { HelpGuide } from './components/HelpGuide';

function AppContent() {
  const [showHelpGuide, setShowHelpGuide] = useState(true);
  const [helpGuideSection, setHelpGuideSection] = useState<'activity' | 'lesson' | 'unit' | 'assign' | undefined>(undefined);
  
  // Add error boundary for useAuth
  let user, loading;
  try {
    const auth = useAuth();
    user = auth.user;
    loading = auth.loading;
  } catch (error) {
    console.error('Auth error:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600">Please refresh the page to try again.</p>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!user) {
    return <LoginForm />;
  }
  
  const handleOpenGuide = (section?: 'activity' | 'lesson' | 'unit' | 'assign') => {
    setHelpGuideSection(section);
    setShowHelpGuide(true);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 pt-16 min-h-0">
        <Dashboard />
      </main>
      <Footer />
      <HelpGuide 
        isOpen={showHelpGuide} 
        onClose={() => setShowHelpGuide(false)} 
        initialSection={helpGuideSection}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ClassProvider>
          <DataProvider>
            <AppContent />
          </DataProvider>
        </ClassProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;