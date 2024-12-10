import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import stripeService, { SUBSCRIPTION_PLANS } from '../../services/stripe';

const PricingCard = ({ plan, isPopular, onSubscribe, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="relative"
  >
    {isPopular && (
      <div className="absolute -top-5 left-0 right-0 flex justify-center z-10">
        <span className="px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-medium rounded-full shadow-lg">
          Plus populaire
        </span>
      </div>
    )}
    <div className={`relative p-8 rounded-xl backdrop-blur-sm border ${
      isPopular 
        ? 'bg-white/10 border-purple-500/50' 
        : 'bg-white/5 border-white/10'
    }`}>
      <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-white">{plan.price}€</span>
        <span className="text-gray-400">/mois</span>
      </div>
      <ul className="space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => onSubscribe(plan)}
        disabled={loading || plan.id === 'free'}
        className={`w-full py-3 px-6 text-center rounded-lg font-semibold transition-all ${
          loading 
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:opacity-90'
        } ${
          isPopular
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
            : 'bg-white/10 text-white hover:bg-white/20'
        }`}
      >
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          </div>
        ) : (
          plan.id === 'free' ? 'Plan actuel' : "S'abonner"
        )}
      </button>
    </div>
  </motion.div>
);

const Pricing = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = async (plan) => {
    if (!user) {
      navigate('/login', { state: { from: '/pricing' } });
      return;
    }

    if (plan.id === 'free') return;

    try {
      setLoading(true);
      await stripeService.createCheckoutSession(user.uid, plan.stripePriceId);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    SUBSCRIPTION_PLANS.FREE,
    {
      ...SUBSCRIPTION_PLANS.PRO,
      isPopular: true
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <SparklesIcon className="w-5 h-5 mr-2" />
            <span>Tarifs simples</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Choisissez le plan qui vous convient
          </h2>
          <p className="text-xl text-gray-400">
            Commencez gratuitement et évoluez selon vos besoins
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              isPopular={plan.isPopular}
              onSubscribe={handleSubscribe}
              loading={loading}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
