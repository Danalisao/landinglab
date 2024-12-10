import React from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import LandingPageContent from './LandingPageContent';

const RawLandingPage = () => {
  const { id } = useParams();
  const [landingPage, setLandingPage] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
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

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <LandingPageContent landingPage={landingPage} />;
};

export default RawLandingPage;
