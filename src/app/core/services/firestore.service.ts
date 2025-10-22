import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  WithFieldValue,
  DocumentData,
  Unsubscribe,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private firestore = inject(Firestore);
  private injector = inject(Injector);

  /**
   * Creates a new document in the specified collection with the given data.
   */
  async createDocument(
    collectionPath: string,
    docId: string,
    data: WithFieldValue<DocumentData>
  ): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      const ref = doc(this.firestore, `${collectionPath}/${docId}`);
      await setDoc(ref, data);
    });
  }

  /**
   * Reads a document from the specified collection.
   */
  async readDocument<T extends DocumentData>(
    collectionPath: string,
    docId: string
  ): Promise<T | undefined> {
    return runInInjectionContext(this.injector, async () => {
      const ref = doc(this.firestore, `${collectionPath}/${docId}`);
      const snapshot = await getDoc(ref);
      return snapshot.exists() ? (snapshot.data() as T) : undefined;
    });
  }

  /**
   * Updates an existing document in the specified collection.
   */
  async updateDocument(
    collectionPath: string,
    docId: string,
    data: Partial<WithFieldValue<DocumentData>>
  ): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      const ref = doc(this.firestore, `${collectionPath}/${docId}`);
      await updateDoc(ref, data);
    });
  }

  /**
   * Sets document data with merge option.
   * Creates the document if it doesn't exist, or merges with existing data.
   */
  async setDocument(
    collectionPath: string,
    docId: string,
    data: Partial<WithFieldValue<DocumentData>>
  ): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      const ref = doc(this.firestore, `${collectionPath}/${docId}`);
      await setDoc(ref, data, { merge: true });
    });
  }

  /**
   * Listens to changes in a document in real-time.
   * Returns an unsubscribe function to stop listening.
   */
  onDocumentSnapshot<T extends DocumentData>(
    collectionPath: string,
    docId: string,
    callback: (data: T | undefined) => void
  ): Unsubscribe {
    return runInInjectionContext(this.injector, () => {
      const ref = doc(this.firestore, `${collectionPath}/${docId}`);
      return onSnapshot(ref, (snapshot) => {
        const data = snapshot.exists() ? (snapshot.data() as T) : undefined;
        callback(data);
      });
    });
  }
}
