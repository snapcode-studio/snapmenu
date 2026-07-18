import { db } from './firebase-config';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, onSnapshot, writeBatch, setDoc } from "firebase/firestore";

export async function addMenuItem(userId, item, currentCount) {
  try {
    const itemsRef = collection(db, "users", userId, "menuItems");
    const docRef = await addDoc(itemsRef, {
      ...item,
      orderIndex: currentCount,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

export async function deleteMenuItem(userId, itemId) {
  try {
    await deleteDoc(doc(db, "users", userId, "menuItems", itemId));
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
}

export function listenToMenu(userId, callback) {
  const itemsRef = collection(db, "users", userId, "menuItems");
  const q = query(itemsRef, orderBy("orderIndex", "asc"));
  
  return onSnapshot(q, (snapshot) => {
    const items = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    callback(items);
  });
}

export async function updateMenuOrder(userId, orderedIds) {
  try {
    const batch = writeBatch(db);
    orderedIds.forEach((id, index) => {
      const itemRef = doc(db, "users", userId, "menuItems", id);
      batch.update(itemRef, { orderIndex: index });
    });
    await batch.commit();
  } catch (e) {
    console.error("Error updating order: ", e);
    throw e;
  }
}

// Zapis wyglądu
export async function saveTheme(userId, themeObj) {
  try {
    const themeRef = doc(db, "users", userId, "settings", "theme");
    await setDoc(themeRef, themeObj, { merge: true });
  } catch(e) {
    console.error("Error saving theme", e);
    throw e;
  }
}

// Nasłuchiwanie wyglądu
export function listenToTheme(userId, callback) {
  const themeRef = doc(db, "users", userId, "settings", "theme");
  return onSnapshot(themeRef, (docSnap) => {
    if(docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback({ 
        bgColor: '#000000', 
        textColor: '#ffffff', 
        fontFamily: "'Inter', sans-serif",
        restaurantName: "Nasze Menu"
      });
    }
  });
}
