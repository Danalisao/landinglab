import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { ArrowLeftIcon, DevicePhoneMobileIcon, ComputerDesktopIcon, DeviceTabletIcon } from '@heroicons/react/24/outline';
import LandingPageContent from './LandingPageContent';

const PreviewLandingPage = () => {
  const { id } = useParams();
  const [landingPage, setLandingPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewportSize, setViewportSize] = useState('desktop'); // mobile, tablet, desktop

  useEffect(() => {
    const fetchLandingPage = async () => {
      try {
        const docRef = doc(db, 'landingPages', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setLandingPage(docSnap.data());
        } else {
          setError('Page non trouvée');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la landing page:', error);
        setError('Erreur lors de la récupération de la landing page');
      } finally {
        setLoading(false);
      }
    };

    fetchLandingPage();
  }, [id]);

  const getViewportClass = () => {
    switch (viewportSize) {
      case 'mobile':
        return 'w-[375px]';
      case 'tablet':
        return 'w-[768px]';
      case 'desktop':
      default:
        return 'w-full max-w-[1440px]';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link
              to={`/edit-landing-page/${id}`}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Retour à l'éditeur
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewportSize('mobile')}
              className={`p-2 rounded-lg ${
                viewportSize === 'mobile' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Vue mobile"
            >
              <DevicePhoneMobileIcon className="h-6 w-6" />
            </button>
            <button
              onClick={() => setViewportSize('tablet')}
              className={`p-2 rounded-lg ${
                viewportSize === 'tablet' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Vue tablette"
            >
              <DeviceTabletIcon className="h-6 w-6" />
            </button>
            <button
              onClick={() => setViewportSize('desktop')}
              className={`p-2 rounded-lg ${
                viewportSize === 'desktop' ? 'bg-purple-100 text-purple-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Vue desktop"
            >
              <ComputerDesktopIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Container */}
      <div className="p-8">
        <div className="mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out"
             style={{ maxWidth: '1440px' }}>
          <div className={`${getViewportClass()} mx-auto transition-all duration-300 ease-in-out`}>
            <iframe
              title="Landing Page Preview"
              className="w-full h-[800px] border-0"
              src={`/raw-landing-page/${id}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewLandingPage;
