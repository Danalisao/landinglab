import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SparklesIcon, PlusIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import LandingPageCard from './LandingPageCard';
import landingPageService from '../../services/landingPage';

const Dashboard = () => {
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const loadPages = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setError(null);
        const fetchedPages = await landingPageService.getUserPages(user.uid);
        if (isMounted) {
          setPages(fetchedPages);
        }
      } catch (error) {
        console.error('Error loading pages:', error);
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPages();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleDelete = (pageId) => {
    setPages(pages.filter(page => page.id !== pageId));
  };

  const handleDuplicate = (newPage) => {
    setPages([...pages, newPage]);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-24">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">Veuillez vous connecter pour voir vos landing pages.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto px-6">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <SparklesIcon className="w-5 h-5 mr-2" />
            <span>Vos landing pages</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Gérez vos pages
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              en toute simplicité
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Créez, modifiez et publiez vos landing pages en quelques clics. Notre IA vous aide à optimiser chaque aspect de vos pages.
          </p>
          <Link
            to="/create-landing-page"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Créer une nouvelle page
          </Link>
        </motion.div>

        {/* Grille de pages */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[200px] text-center">
            <div className="text-gray-400">
              <ExclamationCircleIcon className="w-8 h-8 mb-4" />
              <p>Erreur de chargement des pages : {error}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <LandingPageCard
                key={page.id}
                page={page}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            ))}
            {pages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-16"
              >
                <p className="text-gray-400 text-lg mb-4">
                  Vous n'avez pas encore créé de landing page.
                </p>
                <Link
                  to="/create-landing-page"
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Créer ma première page
                </Link>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
