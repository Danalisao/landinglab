import Stripe from 'stripe';
import { db } from '../src/config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata.userId;
        
        // Mettre à jour l'utilisateur avec les informations d'abonnement
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          stripeCustomerId: session.customer,
          subscriptionId: session.subscription,
          planId: 'pro',
          subscriptionStatus: 'active',
          subscriptionStart: new Date()
        });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userRef = doc(db, 'users', subscription.metadata.userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          await updateDoc(userRef, {
            subscriptionStatus: subscription.status,
            subscriptionEnd: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000)
              : null
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userRef = doc(db, 'users', subscription.metadata.userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          await updateDoc(userRef, {
            planId: 'free',
            subscriptionStatus: 'canceled',
            subscriptionEnd: new Date()
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const userRef = doc(db, 'users', invoice.metadata.userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          await updateDoc(userRef, {
            subscriptionStatus: 'past_due'
          });
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}
