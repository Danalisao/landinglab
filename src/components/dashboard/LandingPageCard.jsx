import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EllipsisHorizontalIcon, PencilSquareIcon, DocumentDuplicateIcon, TrashIcon, GlobeAltIcon, EyeIcon } from '@heroicons/react/24/outline';
import landingPageService from '../../services/landingPage';

const LandingPageCard = ({ page, onDelete, onDuplicate }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    navigate(`/edit-landing-page/${page.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) {
      setIsLoading(true);
      try {
        await landingPageService.deletePage(page.id);
        onDelete(page.id);
      } catch (error) {
        console.error('Error deleting page:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDuplicate = async () => {
    setIsLoading(true);
    try {
      const newPage = await landingPageService.duplicatePage(page);
      onDuplicate(newPage);
    } catch (error) {
      console.error('Error duplicating page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    setIsLoading(true);
    try {
      const newStatus = page.status === 'published' ? 'draft' : 'published';
      await landingPageService.updatePageStatus(page.id, newStatus);
      page.status = newStatus;
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-xl backdrop-blur-sm border bg-white/5 border-white/10 overflow-hidden hover:bg-white/10 transition-colors"
    >
      {/* Statut */}
      <div className="absolute top-4 left-4">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            page.status === 'published'
              ? 'bg-green-500/10 text-green-400'
              : 'bg-yellow-500/10 text-yellow-400'
          }`}
        >
          {page.status === 'published' ? 'Publié' : 'Brouillon'}
        </span>
      </div>

      {/* Menu */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          disabled={isLoading}
        >
          <EllipsisHorizontalIcon className="w-5 h-5 text-gray-400" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 shadow-xl z-10 overflow-hidden">
            <div className="py-1">
              <button
                onClick={handleEdit}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors"
              >
                <PencilSquareIcon className="w-4 h-4 mr-3" />
                Modifier
              </button>
              <button
                onClick={handleDuplicate}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors"
              >
                <DocumentDuplicateIcon className="w-4 h-4 mr-3" />
                Dupliquer
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <TrashIcon className="w-4 h-4 mr-3" />
                Supprimer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-6 mt-8">
        <h3 className="text-xl font-semibold text-white mb-2">
          {page.title}
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          Créée le {new Date(page.createdAt).toLocaleDateString()}
        </p>
        
        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.open(`/preview/${page.id}`, '_blank')}
            className="flex items-center px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            Aperçu
          </button>
          {page.status === 'published' && (
            <button
              onClick={() => window.open(page.url, '_blank')}
              className="flex items-center px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-colors"
            >
              <GlobeAltIcon className="w-4 h-4 mr-2" />
              Voir en ligne
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LandingPageCard;
