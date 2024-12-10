import { db } from '../config/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  orderBy,
  addDoc
} from 'firebase/firestore';

class LandingPageService {
  async getUserPages(userId) {
    if (!userId) {
      throw new Error('UserId is required');
    }

    try {
      const landingPagesRef = collection(db, 'landingPages');
      
      // Essayer d'abord avec l'index
      try {
        const indexedQuery = query(
          landingPagesRef,
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(indexedQuery);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (indexError) {
        // Si l'erreur contient "index", on bascule sur le tri côté client
        if (indexError.message.includes('index')) {
          console.log('Index not ready, falling back to client-side sorting');
          
          const fallbackQuery = query(
            landingPagesRef,
            where('userId', '==', userId)
          );
          
          const querySnapshot = await getDocs(fallbackQuery);
          const pages = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          return pages.sort((a, b) => b.createdAt - a.createdAt);
        } else {
          // Si c'est une autre erreur, on la propage
          throw indexError;
        }
      }
    } catch (error) {
      console.error('Error fetching landing pages:', error);
      throw new Error('Impossible de charger vos landing pages. Veuillez réessayer.');
    }
  }

  async deletePage(pageId) {
    if (!pageId) {
      throw new Error('PageId is required');
    }

    try {
      await deleteDoc(doc(db, 'landingPages', pageId));
    } catch (error) {
      console.error('Error deleting landing page:', error);
      throw new Error('Impossible de supprimer la landing page. Veuillez réessayer.');
    }
  }

  async updatePageStatus(pageId, status) {
    if (!pageId) {
      throw new Error('PageId is required');
    }

    if (!status) {
      throw new Error('Status is required');
    }

    try {
      await updateDoc(doc(db, 'landingPages', pageId), {
        status,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating landing page status:', error);
      throw new Error('Impossible de mettre à jour le statut de la landing page. Veuillez réessayer.');
    }
  }

  async duplicatePage(page) {
    if (!page) {
      throw new Error('Page is required');
    }

    try {
      const newPage = {
        ...page,
        title: `${page.title} (copie)`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deployment: null
      };
      
      delete newPage.id;
      
      const docRef = await addDoc(collection(db, 'landingPages'), newPage);
      return {
        id: docRef.id,
        ...newPage
      };
    } catch (error) {
      console.error('Error duplicating landing page:', error);
      throw new Error('Impossible de dupliquer la landing page. Veuillez réessayer.');
    }
  }
}

export default new LandingPageService();
