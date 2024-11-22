import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

const App: React.FC = () => {
  useAuth(); // Initialize authentication listener

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <div>Bienvenue sur Belote Online</div>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default App;