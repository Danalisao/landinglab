import { db } from '../config/firebase';
import { collection, doc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { inject } from '@vercel/analytics';

// Initialiser Vercel Analytics
inject();

class AnalyticsService {
  constructor() {
    this.analyticsCollection = 'analytics';
  }

  async trackPageView(landingPageId, sessionId) {
    try {
      const analyticsRef = doc(db, this.analyticsCollection, landingPageId);
      const analyticsDoc = await getDoc(analyticsRef);

      const timestamp = new Date().toISOString();
      const dayKey = timestamp.split('T')[0];

      if (!analyticsDoc.exists()) {
        await this.initializeAnalytics(landingPageId);
      }

      // Mettre à jour les statistiques
      await updateDoc(analyticsRef, {
        [`pageViews.${dayKey}`]: (analyticsDoc.data()?.pageViews?.[dayKey] || 0) + 1,
        totalPageViews: (analyticsDoc.data()?.totalPageViews || 0) + 1,
        [`sessions.${sessionId}`]: {
          startTime: timestamp,
          lastActivity: timestamp
        }
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  async trackCTAClick(landingPageId, sessionId) {
    try {
      const analyticsRef = doc(db, this.analyticsCollection, landingPageId);
      const analyticsDoc = await getDoc(analyticsRef);

      const timestamp = new Date().toISOString();
      const dayKey = timestamp.split('T')[0];

      await updateDoc(analyticsRef, {
        [`ctaClicks.${dayKey}`]: (analyticsDoc.data()?.ctaClicks?.[dayKey] || 0) + 1,
        totalCtaClicks: (analyticsDoc.data()?.totalCtaClicks || 0) + 1,
        [`sessions.${sessionId}.lastActivity`]: timestamp,
        [`sessions.${sessionId}.ctaClicked`]: true
      });
    } catch (error) {
      console.error('Error tracking CTA click:', error);
    }
  }

  async getPageAnalytics(landingPageId) {
    try {
      const analyticsRef = doc(db, this.analyticsCollection, landingPageId);
      const analyticsDoc = await getDoc(analyticsRef);

      if (!analyticsDoc.exists()) {
        return await this.initializeAnalytics(landingPageId);
      }

      return this.calculateMetrics(analyticsDoc.data());
    } catch (error) {
      console.error('Error getting page analytics:', error);
      throw error;
    }
  }

  async getUserAnalytics(userId) {
    try {
      // Obtenir toutes les landing pages de l'utilisateur
      const pagesQuery = query(
        collection(db, 'landingPages'),
        where('userId', '==', userId)
      );
      const pagesSnapshot = await getDocs(pagesQuery);

      // Récupérer les analytics pour chaque page
      const analytics = await Promise.all(
        pagesSnapshot.docs.map(async (pageDoc) => {
          const pageAnalytics = await this.getPageAnalytics(pageDoc.id);
          return {
            pageId: pageDoc.id,
            title: pageDoc.data().title,
            ...pageAnalytics
          };
        })
      );

      return analytics;
    } catch (error) {
      console.error('Error getting user analytics:', error);
      throw error;
    }
  }

  async initializeAnalytics(landingPageId) {
    const initialData = {
      pageViews: {},
      ctaClicks: {},
      sessions: {},
      totalPageViews: 0,
      totalCtaClicks: 0,
      createdAt: new Date().toISOString()
    };

    const analyticsRef = doc(db, this.analyticsCollection, landingPageId);
    await updateDoc(analyticsRef, initialData);

    return initialData;
  }

  calculateMetrics(data) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    // Calculer les métriques des 30 derniers jours
    const dailyMetrics = {};
    let currentDate = new Date(thirtyDaysAgo);

    while (currentDate <= now) {
      const dayKey = currentDate.toISOString().split('T')[0];
      dailyMetrics[dayKey] = {
        pageViews: data.pageViews[dayKey] || 0,
        ctaClicks: data.ctaClicks[dayKey] || 0
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculer le taux de conversion
    const conversionRate = data.totalPageViews > 0
      ? (data.totalCtaClicks / data.totalPageViews) * 100
      : 0;

    // Calculer le taux de rebond
    const sessions = Object.values(data.sessions || {});
    const bouncedSessions = sessions.filter(
      session => !session.ctaClicked
    ).length;
    const bounceRate = sessions.length > 0
      ? (bouncedSessions / sessions.length) * 100
      : 0;

    return {
      dailyMetrics,
      totalPageViews: data.totalPageViews,
      totalCtaClicks: data.totalCtaClicks,
      conversionRate,
      bounceRate
    };
  }
}

export default new AnalyticsService();
