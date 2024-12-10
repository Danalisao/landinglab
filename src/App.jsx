import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './components/dashboard/Dashboard';
import CreateLandingPage from './components/pages/CreateLandingPage';
import EditLandingPage from './components/pages/EditLandingPage';
import PreviewLandingPage from './components/pages/PreviewLandingPage';
import RawLandingPage from './components/pages/RawLandingPage';
import SubscriptionPage from './components/subscription/SubscriptionPage';
import Home from './components/home/Home';
import Demo from './components/demo/Demo';
import Features from './components/features/Features';
import Pricing from './components/pricing/Pricing';
import Contact from './components/contact/Contact';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Route sans layout pour la prévisualisation brute */}
          <Route path="/raw-landing-page/:id" element={<RawLandingPage />} />
          
          {/* Routes avec layout */}
          <Route element={
            <div className="min-h-screen flex flex-col bg-black">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/login" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/demo" element={<Demo />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/subscription"
                    element={
                      <ProtectedRoute>
                        <SubscriptionPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/create-landing-page"
                    element={
                      <ProtectedRoute>
                        <CreateLandingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit-landing-page/:id"
                    element={
                      <ProtectedRoute>
                        <EditLandingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/preview/:id" element={<PreviewLandingPage />} />
                  <Route path="/" element={<Home />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } path="/*" />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;