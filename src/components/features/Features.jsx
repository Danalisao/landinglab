import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import {
  SparklesIcon,
  BoltIcon,
  PaintBrushIcon,
  ChartBarIcon,
  CloudArrowUpIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Feature = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="relative group"
  >
    <div className="absolute -inset-px bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur-lg" />
    <div className="relative p-8 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20">
        <Icon className="w-6 h-6 text-purple-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  </motion.div>
);

const Features = () => {
  const { user } = useAuth();
  const features = [
    {
      icon: SparklesIcon,
      title: 'IA Générative',
      description: 'Notre IA analyse votre projet et génère automatiquement le contenu et le design optimal pour votre landing page.'
    },
    {
      icon: BoltIcon,
      title: 'Création Rapide',
      description: 'Créez une landing page professionnelle en quelques minutes, sans connaissances techniques requises.'
    },
    {
      icon: PaintBrushIcon,
      title: 'Design Personnalisable',
      description: 'Personnalisez facilement les couleurs, polices et mise en page pour correspondre à votre identité de marque.'
    },
    {
      icon: ChartBarIcon,
      title: 'Optimisation Conversion',
      description: 'Éléments et textes optimisés par l\'IA pour maximiser vos taux de conversion.'
    },
    {
      icon: CloudArrowUpIcon,
      title: 'Publication Instantanée',
      description: 'Publiez votre landing page en un clic et commencez à recevoir des visiteurs immédiatement.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'SEO Optimisé',
      description: 'Pages optimisées pour les moteurs de recherche avec des balises meta et une structure sémantique.'
    }
  ];

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
            <span>Fonctionnalités</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Tout ce dont vous avez besoin pour créer des
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              landing pages qui convertissent
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Des outils puissants et intuitifs pour créer des landing pages performantes, le tout propulsé par l'intelligence artificielle.
          </p>
        </motion.div>

        {/* Grille de fonctionnalités */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <Link
            to={user ? "/dashboard" : "/signup"}
            className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            {user ? "Accéder au dashboard" : "Commencer gratuitement"}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
