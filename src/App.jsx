import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import { useAuth } from './contexts/AuthContext';

const AuthenticatedApp = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Main />
      <Footer />
    </div>
  );
};

const UnauthenticatedApp = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">
        <SignIn />
        <SignUp />
      </div>
      <Footer />
    </div>
  );
};

function App() {
  const { user } = useAuth();

  return (
    <AuthProvider>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </AuthProvider>
  );
}

export default App;