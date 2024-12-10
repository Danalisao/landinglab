import Stripe from 'stripe';
import { db } from '../src/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  try {
    const { userId } = req.body;

    // Récupérer les informations de l'utilisateur
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
      return;
    }

    const userData = userDoc.data();
    
    if (!userData.subscriptionId) {
      res.status(400).json({ error: 'Aucun abonnement actif trouvé' });
      return;
    }

    // Annuler l'abonnement dans Stripe
    const subscription = await stripe.subscriptions.update(
      userData.subscriptionId,
      {
        cancel_at_period_end: true
      }
    );

    res.json({ success: true, subscription });
  } catch (err) {
    console.error('Error canceling subscription:', err);
    res.status(500).json({ error: err.message });
  }
}
