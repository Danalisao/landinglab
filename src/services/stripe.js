import { loadStripe } from '@stripe/stripe-js';
import { db } from '../config/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Plans disponibles
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    features: [
      '1 page de destination',
      'Analytics de base',
      'Modèles de base',
      'Support par email'
    ],
    limits: {
      maxPages: 1,
      abTesting: false,
      customDomains: false
    }
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 15,
    stripePriceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
    features: [
      '5 pages de destination',
      'Analytics avancés',
      'A/B Testing',
      'Domaines personnalisés',
      'Tous les modèles',
      'Support prioritaire'
    ],
    limits: {
      maxPages: 5,
      abTesting: true,
      customDomains: true
    }
  }
};

class StripeService {
  async createCheckoutSession(userId, priceId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('Utilisateur non trouvé');
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          customerEmail: userDoc.data().email
        }),
      });

      const session = await response.json();
      
      // Rediriger vers Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  async cancelSubscription(userId) {
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'annulation de l\'abonnement');
      }

      // Mettre à jour le statut dans Firestore
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        subscriptionStatus: 'canceled',
        planId: 'free',
        subscriptionEnd: serverTimestamp()
      });

      return true;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  async getUserSubscription(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('Utilisateur non trouvé');
      }

      const userData = userDoc.data();
      return {
        planId: userData.planId || 'free',
        subscriptionStatus: userData.subscriptionStatus || 'none',
        subscriptionEnd: userData.subscriptionEnd,
        stripeCustomerId: userData.stripeCustomerId
      };
    } catch (error) {
      console.error('Error getting user subscription:', error);
      throw error;
    }
  }

  async checkUserCanAccessFeature(userId, feature) {
    try {
      const subscription = await this.getUserSubscription(userId);
      const plan = SUBSCRIPTION_PLANS[subscription.planId.toUpperCase()];
      
      if (!plan) {
        return false;
      }

      return plan.limits[feature] === true;
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  }

  async checkUserCanCreatePage(userId) {
    try {
      const subscription = await this.getUserSubscription(userId);
      const plan = SUBSCRIPTION_PLANS[subscription.planId.toUpperCase()];
      
      if (!plan) {
        return false;
      }

      // Vérifier le nombre actuel de pages
      const pagesRef = collection(db, 'landingPages');
      const q = query(pagesRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);
      
      return snapshot.size < plan.limits.maxPages;
    } catch (error) {
      console.error('Error checking page creation limit:', error);
      return false;
    }
  }
}

export default new StripeService();
