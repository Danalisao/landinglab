import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import LandingPageForm from '../forms/LandingPageForm';

const EditLandingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [landingPage, setLandingPage] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLandingPage = async () => {
      try {
        // Vérifier si l'utilisateur est authentifié
        if (!user) {
          setError('Vous devez être connecté pour accéder à cette page');
          navigate('/login');
          return;
        }

        const docRef = doc(db, 'landingPages', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.userId !== user.uid) {
            setError('Vous n\'avez pas accès à cette page');
            navigate('/dashboard');
            return;
          }
          setLandingPage(data);
        } else {
          setError('Page non trouvée');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la landing page:', error);
        setError('Erreur lors de la récupération de la landing page');
      } finally {
        setPageLoading(false);
      }
    };

    // Attendre que l'état d'authentification soit chargé
    if (!loading) {
      fetchLandingPage();
    }
  }, [id, user, loading, navigate]);

  const handleSubmit = async (formData) => {
    try {
      if (!user) {
        throw new Error('Vous devez être connecté pour effectuer cette action');
      }

      const docRef = doc(db, 'landingPages', id);
      await updateDoc(docRef, formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setError('Erreur lors de la mise à jour de la landing page');
    }
  };

  if (loading || pageLoading) {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">
        Modifier la Landing Page
      </h1>
      {landingPage && (
        <LandingPageForm
          initialValues={landingPage}
          onSubmit={handleSubmit}
          submitButtonText="Mettre à jour"
        />
      )}
    </div>
  );
};

export default EditLandingPage;
