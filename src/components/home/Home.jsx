import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SparklesIcon, BeakerIcon, ChartBarIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const GradientText = ({ children }) => (
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
    {children}
  </span>
);

const Feature = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="relative group"
  >
    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
    <div className="relative p-8 bg-black rounded-lg">
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20">
        <Icon className="w-6 h-6 text-purple-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  </motion.div>
);

const CommandLine = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="w-full max-w-2xl mx-auto bg-gray-900 rounded-lg overflow-hidden shadow-2xl"
  >
    <div className="flex items-center px-4 py-2 bg-gray-800">
      <div className="flex space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
    </div>
    <div className="p-4 font-mono text-sm text-gray-300">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <span className="text-purple-400">$</span> npx create-landing-page mon-projet
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <span className="text-green-400">✓</span> Configuration IA initialisée
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        <span className="text-green-400">✓</span> Landing page générée
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
      >
        <span className="text-purple-400">✓</span> Prête en 2.4 secondes
      </motion.div>
    </div>
  </motion.div>
);

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative container mx-auto px-6 text-center"
        >
          <div className="inline-flex items-center px-4 py-2 mb-8 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700">
            <SparklesIcon className="w-5 h-5 text-purple-400 mr-2" />
            <span className="text-sm">Propulsé par l'IA de dernière génération</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 max-w-4xl mx-auto leading-tight">
            Créez des landing pages qui
            <br />
            <GradientText>convertissent en quelques minutes</GradientText>
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            LandingLab combine l'IA et le design pour créer des pages de destination
            qui captivent vos visiteurs et maximisent vos conversions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 transition-opacity w-full sm:w-auto"
            >
              {user ? "Accéder au dashboard" : "Démarrer gratuitement"}
            </Link>
            <Link
              to="/demo"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-lg font-semibold hover:bg-white/20 transition-colors w-full sm:w-auto"
            >
              Voir la démo
            </Link>
          </div>

          <CommandLine />
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Créez votre landing page en <GradientText>3 étapes simples</GradientText>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Pas besoin d'être un expert en design ou en développement. Notre assistant IA vous guide à chaque étape.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                1
              </div>
              <div className="mb-4">
                <LightBulbIcon className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Décrivez votre projet</h3>
              <p className="text-gray-400">
                Expliquez simplement votre produit ou service en langage naturel. Notre IA comprend vos besoins et objectifs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                2
              </div>
              <div className="mb-4">
                <SparklesIcon className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">L'IA génère votre page</h3>
              <p className="text-gray-400">
                Notre IA crée une landing page optimisée avec un design professionnel, des textes persuasifs et des appels à l'action efficaces.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="relative p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                3
              </div>
              <div className="mb-4">
                <BeakerIcon className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Personnalisez et publiez</h3>
              <p className="text-gray-400">
                Ajustez facilement les couleurs, images et textes selon vos préférences. Publiez en un clic et commencez à convertir.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              {user ? "Accéder au dashboard" : "Créer ma première landing page"}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-black/50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl font-bold mb-4">
              <GradientText>L'IA au service de votre conversion</GradientText>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Notre technologie analyse votre marché et optimise chaque élément
              de votre landing page pour maximiser son impact.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature
              icon={LightBulbIcon}
              title="Copywriting par IA"
              description="Notre IA génère un contenu persuasif et optimisé pour votre audience cible."
            />
            <Feature
              icon={BeakerIcon}
              title="Tests A/B automatisés"
              description="Optimisez en continu avec des tests A/B pilotés par l'intelligence artificielle."
            />
            <Feature
              icon={ChartBarIcon}
              title="Analytics prédictifs"
              description="Anticipez les tendances et optimisez vos conversions avec nos analytics IA."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-purple-900/20" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative container mx-auto px-6 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 max-w-2xl mx-auto">
            Prêt à révolutionner vos
            <br />
            <GradientText>landing pages ?</GradientText>
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Rejoignez les entreprises innovantes qui utilisent déjà LandingLab
            pour créer des landing pages qui convertissent.
          </p>
          <Link
            to={user ? "/dashboard" : "/signup"}
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            {user ? "Accéder au dashboard" : "Commencer gratuitement"}
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
