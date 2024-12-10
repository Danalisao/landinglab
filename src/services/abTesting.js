import { db } from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  query,
  where,
  getDocs
} from 'firebase/firestore';

const AB_TESTS_COLLECTION = 'abTests';
const VARIANTS_COLLECTION = 'variants';

class ABTestingService {
  async createTest(landingPageId, variants) {
    const testDoc = doc(collection(db, AB_TESTS_COLLECTION));
    const testId = testDoc.id;

    const testData = {
      id: testId,
      landingPageId,
      status: 'active',
      startDate: new Date().toISOString(),
      variants: variants.map((variant, index) => ({
        id: `variant_${index}`,
        content: variant,
        impressions: 0,
        conversions: 0,
        conversionRate: 0
      })),
      winningVariantId: null
    };

    await setDoc(testDoc, testData);
    return testId;
  }

  async getActiveTest(landingPageId) {
    const testsRef = collection(db, AB_TESTS_COLLECTION);
    const q = query(
      testsRef,
      where('landingPageId', '==', landingPageId),
      where('status', '==', 'active')
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    };
  }

  async getTestResults(testId) {
    const testDoc = await getDoc(doc(db, AB_TESTS_COLLECTION, testId));
    if (!testDoc.exists()) return null;

    const data = testDoc.data();
    return {
      ...data,
      variants: data.variants.map(variant => ({
        ...variant,
        conversionRate: variant.impressions > 0
          ? (variant.conversions / variant.impressions) * 100
          : 0
      }))
    };
  }

  async trackImpression(testId, variantId) {
    const testDoc = doc(db, AB_TESTS_COLLECTION, testId);
    const test = await getDoc(testDoc);
    
    if (!test.exists() || test.data().status !== 'active') return;

    const variantIndex = test.data().variants.findIndex(v => v.id === variantId);
    if (variantIndex === -1) return;

    await updateDoc(testDoc, {
      [`variants.${variantIndex}.impressions`]: increment(1)
    });
  }

  async trackConversion(testId, variantId) {
    const testDoc = doc(db, AB_TESTS_COLLECTION, testId);
    const test = await getDoc(testDoc);
    
    if (!test.exists() || test.data().status !== 'active') return;

    const variantIndex = test.data().variants.findIndex(v => v.id === variantId);
    if (variantIndex === -1) return;

    await updateDoc(testDoc, {
      [`variants.${variantIndex}.conversions`]: increment(1)
    });
  }

  async determineWinner(testId) {
    const test = await this.getTestResults(testId);
    if (!test || test.status !== 'active') return null;

    // Calculer le variant avec le meilleur taux de conversion
    const winner = test.variants.reduce((best, current) => {
      if (current.impressions < 100) return best; // Minimum 100 impressions
      return current.conversionRate > best.conversionRate ? current : best;
    }, { conversionRate: -1 });

    if (winner.conversionRate === -1) return null;

    // Mettre à jour le test avec le gagnant
    await updateDoc(doc(db, AB_TESTS_COLLECTION, testId), {
      status: 'completed',
      winningVariantId: winner.id,
      endDate: new Date().toISOString()
    });

    return winner;
  }

  async selectVariant(testId) {
    const test = await this.getTestResults(testId);
    if (!test || test.status !== 'active') return null;

    // Sélection aléatoire pondérée basée sur les performances
    const totalConversions = test.variants.reduce((sum, v) => sum + (v.conversions || 0), 0);
    
    if (totalConversions < 10) {
      // Distribution uniforme au début
      const randomIndex = Math.floor(Math.random() * test.variants.length);
      return test.variants[randomIndex];
    }

    // Distribution pondérée basée sur les taux de conversion
    const weights = test.variants.map(v => 
      v.impressions > 0 ? (v.conversions + 1) / (v.impressions + 2) : 0.5
    );
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const random = Math.random() * totalWeight;
    
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random <= sum) return test.variants[i];
    }

    return test.variants[0];
  }
}

export default new ABTestingService();
