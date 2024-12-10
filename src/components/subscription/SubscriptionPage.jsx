import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import stripeService, { SUBSCRIPTION_PLANS } from '../../services/stripe';

const PlanFeature = ({ active, children }) => (
  <li className="flex items-center space-x-3">
    {active ? (
      <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
    ) : (
      <XMarkIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
    )}
    <span className={active ? "text-gray-300" : "text-gray-500"}>{children}</span>
  </li>
);

const SubscriptionPage = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, [user]);

  const loadSubscription = async () => {
    if (!user) return;

    try {
      const sub = await stripeService.getUserSubscription(user.uid);
      setSubscription(sub);
      setError(null);
    } catch (err) {
      console.error('Error loading subscription:', err);
      setError("Erreur lors du chargement de l'abonnement");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (priceId) => {
    if (!user) return;

    try {
      setProcessingAction(true);
      await stripeService.createCheckoutSession(user.uid, priceId);
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError("Erreur lors de la création de la session de paiement");
    } finally {
      setProcessingAction(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user || !subscription) return;

    try {
      setProcessingAction(true);
      await stripeService.cancelSubscription(user.uid);
      await loadSubscription();
    } catch (err) {
      console.error('Error canceling subscription:', err);
      setError("Erreur lors de l'annulation de l'abonnement");
    } finally {
      setProcessingAction(false);
    }
  };

  const currentPlan = subscription?.status === 'active' 
    ? SUBSCRIPTION_PLANS.PRO 
    : SUBSCRIPTION_PLANS.FREE;

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
            <span>Votre abonnement</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Gérez votre abonnement
          </h2>
          <p className="text-xl text-gray-400">
            Consultez et gérez les détails de votre abonnement
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto text-center p-6 rounded-lg bg-red-500/10 border border-red-500/20"
          >
            <XMarkIcon className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-400">{error}</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="p-8 rounded-xl backdrop-blur-sm border bg-white/10 border-purple-500/50">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {currentPlan.name}
                  </h3>
                  <p className="text-gray-400">
                    {subscription?.status === 'active'
                      ? 'Abonnement actif'
                      : 'Plan gratuit'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">
                    {currentPlan.price}€
                    <span className="text-lg text-gray-400">/mois</span>
                  </div>
                  {subscription?.currentPeriodEnd && (
                    <p className="text-sm text-gray-400 mt-2">
                      Prochain renouvellement le{' '}
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">
                    Fonctionnalités incluses
                  </h4>
                  <ul className="space-y-3">
                    {currentPlan.features.map((feature, index) => (
                      <PlanFeature key={index} active={true}>
                        {feature}
                      </PlanFeature>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-white/10">
                  {subscription?.status === 'active' ? (
                    <button
                      onClick={handleCancelSubscription}
                      disabled={processingAction}
                      className="w-full py-3 px-6 text-center rounded-lg font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingAction ? (
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-400"></div>
                        </div>
                      ) : (
                        "Annuler l'abonnement"
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(SUBSCRIPTION_PLANS.PRO.stripePriceId)}
                      disabled={processingAction}
                      className="w-full py-3 px-6 text-center rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processingAction ? (
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        </div>
                      ) : (
                        'Passer au plan Pro'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;
